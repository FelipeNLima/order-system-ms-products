import { Module } from '@nestjs/common';

import { StockService } from 'src/Application/services/stock.service';
import { StockAdapter } from 'src/Domain/Adapters/stock.adapter';
import { StockRepository } from 'src/Domain/Repositories/stockRepository';
import { ConsumerService } from 'src/Infrastructure/RabbitMQ/rabbitMQ.service';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { StockController } from './stock.controller';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [
    { provide: StockRepository, useClass: StockAdapter },
    ConsumerService,
    StockService,
    PrismaService,
  ],
})
export class StockModule {}
