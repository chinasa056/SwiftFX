// import {
//   OnQueueActive,
//   OnQueueCompleted,
//   OnQueueFailed,
//   Process,
//   Processor,
// } from '@nestjs/bull';
// import type { Job } from 'bull';
// import { Logger, MethodNotAllowedException } from '@nestjs/common';
// import constants from '../constants';
// import { MailService } from '../../mail/mail.service';
// import { EmailJobData } from '../interfaces/job-data.interface';

// @Processor(constants.EMAIL_QUEUE)
// export class EmailProcessor {
//   private readonly logger = new Logger(EmailProcessor.name);

//   constructor(private readonly mailService: MailService) {}

//   @OnQueueActive()
//   onActive(job: Job<EmailJobData>) {
//     this.logger.log(`Processing job ${job.id} of type ${job.data.type}...`);
//   }

//   @OnQueueCompleted()
//   onCompleted(job: Job<EmailJobData>) {
//     this.logger.log(`Completed job ${job.id} of type ${job.data.type}...`);
//   }

//   @OnQueueFailed()
//   onError(job: Job<EmailJobData>, error: Error) {
//     this.logger.error(
//       `Failed job ${job.id} of type ${job.data.type}: ${error.message}`,
//     );
//   }

//   @Process(constants.SEND_EMAIL)
//   async handleEmail(job: Job<EmailJobData>) {
//     const data = job.data;
//     const { type } = data;

//     try {
//       switch (type) {
//         case constants.SEND_WELCOME:
//           return await this.emailWelcome(data);
//         case constants.SEND_CREDENTIALS:
//           return await this.emailCredentials(data);
//         case constants.SEND_VERIFICATION:
//           return await this.emailVerification(data);
//         case constants.SEND_PASSWORD_RESET:
//           return await this.emailPasswordReset(data);
//         case constants.SEND_INVITE:
//           return await this.emailInvite(data);
//         case constants.SEND_ADMIN_NOTIFICATION:
//           return await this.emailAdminNotification(data);
//         default:
//           throw new MethodNotAllowedException(
//             'Not a recognized email job type',
//           );
//       }
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : String(error);
//       this.logger.error(`Error in EmailProcessor [${type}]: ${message}`);
//       throw error;
//     }
//   }

//   private async emailWelcome(data: EmailJobData) {
//     return await this.mailService.sendWelcomeEmailInternal(
//       data.email,
//       data.firstName || '',
//     );
//   }

//   private async emailCredentials(data: EmailJobData) {
//     return await this.mailService.sendCredentialsEmailInternal(
//       data.email,
//       data.firstName || '',
//       data.password || '',
//     );
//   }

//   private async emailVerification(data: EmailJobData) {
//     return await this.mailService.sendVerificationEmailInternal(
//       data.email,
//       data.pin || '',
//     );
//   }

//   private async emailPasswordReset(data: EmailJobData) {
//     return await this.mailService.sendPasswordResetEmailInternal(
//       data.email,
//       data.pin || '',
//     );
//   }

//   private async emailInvite(data: EmailJobData) {
//     return await this.mailService.sendInviteInternal(
//       data.email,
//       data.token || '',
//     );
//   }

//   private async emailAdminNotification(data: EmailJobData) {
//     return await this.mailService.sendNewMemberNotificationInternal(
//       data.adminEmails || [],
//       data.newMemberName || '',
//       data.newMemberEmail || '',
//     );
//   }
// }
