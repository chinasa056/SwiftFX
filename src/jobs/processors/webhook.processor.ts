// import { Process, Processor } from '@nestjs/bull';
// import { Logger } from '@nestjs/common';
// import type { Job } from 'bull';
// import { Inject, forwardRef } from '@nestjs/common';
// import { PaymentService } from '../../payment/payment.service';
// import constants from '../constants';
// import { WebhookJobData } from '../interfaces/job-data.interface';
// import { PaystackWebhookPayload } from '../../interfaces/paystack.interface';
// import { FlutterwaveWebhookPayload } from '../../interfaces/flutterwave.interface';

// @Processor(constants.WEBHOOK_QUEUE)
// export class WebhookProcessor {
//   private readonly logger = new Logger(WebhookProcessor.name);

//   constructor(
//     @Inject(forwardRef(() => PaymentService))
//     private readonly paymentService: PaymentService,
//   ) {}

//   @Process(constants.PROCESS_PAYSTACK_WEBHOOK)
//   async handlePaystackWebhook(job: Job<WebhookJobData>) {
//     const { payload, signature } = job.data;
//     this.logger.log(`Processing Paystack Webhook for ${payload.event}`);
//     try {
//       await this.paymentService.handlePaystackWebhookInternal(
//         payload as PaystackWebhookPayload,
//         signature,
//       );
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : String(error);
//       this.logger.error(`Failed to process Paystack Webhook: ${message}`);
//       throw error;
//     }
//   }

//   @Process(constants.PROCESS_FLUTTERWAVE_WEBHOOK)
//   async handleFlutterwaveWebhook(job: Job<WebhookJobData>) {
//     const { payload, signature } = job.data;
//     this.logger.log(`Processing Flutterwave Webhook for ${payload.event}`);
//     try {
//       await this.paymentService.handleFlutterwaveWebhookInternal(
//         payload as FlutterwaveWebhookPayload,
//         signature,
//       );
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : String(error);
//       this.logger.error(`Failed to process Flutterwave Webhook: ${message}`);
//       throw error;
//     }
//   }
// }
