// import { Module, Global, forwardRef } from '@nestjs/common';
// import { BullModule } from '@nestjs/bullmq';
// import constants from './constants';
// import { EmailQueue } from './queues/email.queue';
// import { WebhookQueue } from './queues/webhook.queue';
// // import { EmailProcessor } from './processors/email.processor';
// // import { WebhookProcessor } from './processors/webhook.processor';
// // import { MailModule } from '../mail/mail.module';
// // import { PaymentModule } from '../payment/payment.module';
// // import config from '../config';

// @Global()
// @Module({
//   imports: [
//     BullModule.forRoot({
//       redis: {
//         host: process.env.REDIS_PORT,
//         port: process.env.REDIS_HOST,
//         // password: config.REDIS.password,
//         family: 4, // Force IPv4
//         connectTimeout: 10000, // 10 seconds timeout
//         retryStrategy: (times) => {
//           // Retry every 2 seconds, up to 10 times
//           if (times <= 10) return 2000;
//           return null;
//         },
//       },
//     }),
//     BullModule.registerQueue(
//       { name: constants.EMAIL_QUEUE },
//       { name: constants.WEBHOOK_QUEUE },
//     ),
//   ],
//   providers: [EmailQueue, WebhookQueue,
//     //  EmailProcessor, WebhookProcessor
//     ],
//   exports: [EmailQueue, WebhookQueue],
// })
// export class JobsModule {}
