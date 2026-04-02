import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import constants from './constants';
import { EmailQueue } from './queues/email.queue';
import { EmailProcessor } from './processors/email.processor';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: constants.EMAIL_QUEUE,
    }),
    EmailModule,
  ],
  providers: [EmailQueue, EmailProcessor],
  exports: [EmailQueue],
})
export class JobsModule {}
