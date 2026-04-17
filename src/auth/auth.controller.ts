import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CompleteProfileInput, RegisterUserInput, VerifyEmailCodeInput } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('startRegister')
  async startRegistration(@Body() data: RegisterUserInput) {
    return this.authService.registerUser(data);
  }

  @Post('verifyEmailCode')
  async verifyEmailCode(@Body() data: VerifyEmailCodeInput) {
    return this.authService.verifyEmailCode(data);
  }

  @Post('completeProfile')
  async completeProfile(@Body() data: CompleteProfileInput) {
    return this.authService.completeProfile(data);
  }
}
