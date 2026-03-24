import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect()
      .then(()=> console.log('Connection to Database established'))
      .catch((error: Error)=> {
        console.log(error)
      });

    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.error('Please check your DATABASE_URL and ensure the database server is running');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}  

