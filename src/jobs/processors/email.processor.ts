import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../../email/email.service';
import constants from '../constants';
import { EmailJobData } from '../interfaces/job-data.interface';

@Processor(constants.EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<any> {
    const { type, email, code, subject, html } = job.data;

    switch (type) {
      case constants.SEND_VERIFICATION:
        return this.emailService.sendVerificationEmail(email, code!);
      
      case constants.SEND_EMAIL:
        return this.emailService.sendEmail(email, subject!, html!);

      default:
        console.warn(`Unknown email job type: ${type}`);
        break;
    }
  }
}
