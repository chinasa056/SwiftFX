import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserInput, RegisterUserResponse } from './auth.dto';
import { CODE_TTL_MS } from 'src/common/constants/auth.constants';

interface PendingRegistration {
  code: string;
  expiresAt: number;
  password?: string;
}

@Injectable()
export class AuthService {
  pending = new Map<string, PendingRegistration>();
  constructor(private readonly prisma: PrismaService) {}

  async reisterUser(data: RegisterUserInput): Promise<RegisterUserResponse> {
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

    return {message: 'Verification mail sent'}
  }

  async verifyEmailCode(){
    
  }
}
