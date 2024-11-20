import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { StockService } from '../../Application/services/stock.service';

@Global()
@Injectable()
export class RabbitMqService implements OnModuleInit {
  private readonly channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(RabbitMqService.name);
  private readonly RABBITMQ_URL = process.env.RABBITMQ_URL;
  private readonly QUEUE = this.configService.get<string>('QUEUE');

  constructor(
    private readonly stockService: StockService,
    private readonly configService: ConfigService,
  ) {
    const connection = amqp.connect([`amqp://${this.RABBITMQ_URL}`]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(`${this.QUEUE}`, { durable: true });
        await channel.consume(`${this.QUEUE}`, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('Received message:', content);
            await this.stockService.update(content);
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
