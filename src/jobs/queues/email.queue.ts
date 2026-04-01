import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import constants from '../constants';

@Injectable()
export class EmailQueue {
  constructor(
    @InjectQueue(constants.EMAIL_QUEUE) private readonly queue: Queue,
  ) {}

  async addJob(type: string, data: any) {
    await this.queue.add(type, data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });
  }
}
