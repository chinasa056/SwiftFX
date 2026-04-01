import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// type SendEmailPayload = {
//   to: string;
//   subject: string;
//   html: string;
// };

// for (let i = 0; i < 3; i++) {
//   try {
//     return await axios.post(...);
//   } catch (err) {
//     if (i === 2) throw err;
//   }
// }
@Injectable()
export class EmailService {
  private readonly baseUrl = 'https://api.brevo.com/v3/smtp/email';
  constructor(private readonly configService: ConfigService){}

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          sender: {
            email: this.configService.getOrThrow<string>('EMAIL_FROM'),
            name: this.configService.getOrThrow<string>("EMAIL_FROM_NAME"),
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        },
        {
          headers: {
            'api-key': this.configService.getOrThrow<string>('BREVO_API_KEY') ,
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
}