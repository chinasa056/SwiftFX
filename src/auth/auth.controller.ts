import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('startRegister')
  async startRegistration(@Body() data: RegisterUserInput) {
    return this.authService.registerUser(data);
  }
}
