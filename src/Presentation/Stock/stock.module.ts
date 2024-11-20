import { Module } from '@nestjs/common';

import { StockService } from '../../Application/services/stock.service';
import { StockAdapter } from '../../Domain/Adapters/stock.adapter';
import { StockRepository } from '../../Domain/Repositories/stockRepository';
import { ConsumerService } from '../../Infrastructure/Apis/consumer.service';
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
