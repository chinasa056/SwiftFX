import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly baseUrl = 'https://api.brevo.com/v3/smtp/email';
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          sender: {
            email: this.configService.getOrThrow<string>('EMAIL_FROM'),
            name: this.configService.getOrThrow<string>('EMAIL_FROM_NAME'),
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        },
        {
          headers: {
            'api-key': this.configService.getOrThrow<string>('BREVO_API_KEY'),
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Brevo email error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async sendVerificationEmail(to: string, code: string) {
    const subject = 'Verify your email';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Welcome to SwiftFX!</h2>
        <p style="font-size: 16px; color: #555;">Thank you for registering. Please use the verification code below to complete your sign-up:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #000; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }
}