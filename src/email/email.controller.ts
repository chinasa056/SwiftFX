import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test')
  async testEmail(@Query('to') to: string) {
    return this.emailService.sendEmail(
      to,
      'Test Email 🚀',
      '<h1>Hello from NestJS + Brevo (Axios)</h1>',
    );
  }
}