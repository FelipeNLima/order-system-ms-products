import {
  Global,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'sqs-consumer';
import { StockService } from '../../Application/services/stock.service';

type Message = {
  Body: string;
};

@Global()
@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private readonly logger = new Logger(ConsumerService.name);
  private readonly QUEUE = this.configService.get<string>('QUEUE');
  private readonly ENDPOINT = this.configService.get<string>('ENDPOINT');

  constructor(
    private readonly stockService: StockService,
    private readonly configService: ConfigService,
  ) {
    this.consumer = Consumer.create({
      queueUrl: `${this.ENDPOINT}${this.QUEUE}`,
      handleMessage: async (message: Message) => this.processMessage(message),
      batchSize: 10,
    });
  }

  onModuleInit() {
    this.consumer.start();
  }

  onModuleDestroy() {
    if (this.consumer) {
      this.consumer.stop();
    }
  }

  public async processMessage(message: Message) {
    try {
      this.logger.log('###[RUN CONSUMER]###');
      const queueBody = message.Body;
      const data = JSON.parse(queueBody);
      await this.stockService.update({
        ...data,
      });
    } catch (err) {
      this.logger.error('###[ERROR CONSUMER]###', err);
    } finally {
      this.logger.log('###[FINISH CONSUMER]###');
    }
  }
}
