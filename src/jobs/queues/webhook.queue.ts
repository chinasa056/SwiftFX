import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import constants from '../constants';

@Injectable()
export class WebhookQueue {
  constructor(
    @InjectQueue(constants.WEBHOOK_QUEUE) private readonly queue: Queue,
  ) {}

  async addJob(type: string, data: any) {
    await this.queue.add(type, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }
}
