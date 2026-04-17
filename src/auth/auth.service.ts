import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteProfileInput, RegisterUserInput, RegisterUserResponse, VerifyEmailCodeInput } from './auth.dto';
import { CODE_TTL_MS, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS, PASSWORD_REQUIREMENTS_MESSAGE } from 'src/common/constants/auth.constants';
import { EmailQueue } from 'src/jobs/queues/email.queue';
import constants from 'src/jobs/constants';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

interface PendingRegistration {
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  pending = new Map<string, PendingRegistration>();
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailQueue: EmailQueue,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(data: RegisterUserInput): Promise<RegisterUserResponse> {
    // check for existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException(
        'An account with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new HttpException(
        'Please enter a valid email address.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + CODE_TTL_MS;
    this.pending.set(data.email, { code, expiresAt });

    setTimeout(() => {
      const rec = this.pending.get(data.email);
      if (rec && rec.expiresAt <= Date.now()) {
        this.pending.delete(data.email);
      }
    }, CODE_TTL_MS + 1000);

    // send verification mail via queue
    await this.emailQueue.addEmailJob({
      type: constants.SEND_VERIFICATION,
      email: data.email,
      code,
    });

    return { message: 'Verification mail sent' };
  }

  async verifyEmailCode(data: VerifyEmailCodeInput) {

    // get the code from the map method
    const record = this.pending.get(data.email);

    if (!record) {
      throw new HttpException(
        'No pending registration found for this email.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (record.expiresAt <= Date.now()) {
      this.pending.delete(data.email);
      throw new HttpException(
        'Verification code has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (record.code !== data.code) {
      throw new HttpException(
        'Invalid verification code.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // remove the code from the map
    this.pending.delete(data.email);

 // Payload depends on flow
    const payload: any = {
      email: data.email,
      purpose: 'complete-profile',
    };
    
    const jwtToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    await this.prisma.registrationToken.create({
      data: {
        email: data.email,
        token: jwtToken,
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    return { registrationToken: jwtToken };

    // // create the user
    // const user = await this.prisma.user.create({
    //   data: {
    //     email: data.email,
    //     password: data.password,
    //   },
    // });

    // return user;  
  }

   private verifyRegistrationToken(token: string, expectedPurpose: string): any {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== expectedPurpose) {
        throw new HttpException(
          'Invalid token purpose',
          HttpStatus.BAD_REQUEST,
        );
      }
      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async completeProfile(data: CompleteProfileInput) {
    const payload = this.verifyRegistrationToken(data.registrationToken, 'complete-profile');
    const existingUser = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    const existingRegistrationToken = await this.prisma.registrationToken.findUnique({
      where: { token: data.registrationToken },
    });

    if (!existingRegistrationToken) {
      throw new HttpException(
        'Registration token not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    
    if (existingUser) {
      throw new HttpException(
        'An account with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }

    this.validatePassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        fullname: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        profilePicture: data.profilePicture,
        passwordHash: data.password,
      },
    });

    await this.prisma.registrationToken.delete({
      where: { token: data.registrationToken },
    });
    return user;
  }

    private validatePassword(password: string): void {
    const meetsAll =
      password.length >= PASSWORD_MIN_LENGTH &&
      PASSWORD_REQUIREMENTS.every((rx) => rx.test(password));
    if (!meetsAll) {
      throw new HttpException(
        PASSWORD_REQUIREMENTS_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
