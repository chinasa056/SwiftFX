import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import constants from './constants';
import { EmailQueue } from './queues/email.queue';
import { EmailProcessor } from './processors/email.processor';
import { EmailModule } from '../email/email.module';
import { EmailService } from 'src/email/email.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: constants.EMAIL_QUEUE,
    }),
    EmailModule,
  ],
  providers: [EmailQueue, EmailProcessor, EmailService],
  exports: [EmailQueue],
})
export class JobsModule {}
