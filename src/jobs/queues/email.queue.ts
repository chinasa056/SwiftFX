import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import constants from '../constants';
import { EmailJobData } from '../interfaces/job-data.interface';

@Injectable()
export class EmailQueue {
  constructor(
    @InjectQueue(constants.EMAIL_QUEUE) private readonly queue: Queue,
  ) {}

  async addEmailJob(data: EmailJobData) {
    await this.queue.add(constants.SEND_EMAIL, data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });
  }
}
