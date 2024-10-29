import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from '../../Application/services/stock.service';
import { StockAdapter } from '../../Domain/Adapters/stock.adapter';
import { StockRepository } from '../../Domain/Repositories/stockRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { HealthController } from '../../Presentation/Health/health.controller';
import { PrismaHealthIndicator } from '../../Presentation/Health/PrismaHealthIndicator.service';
import { StockController } from '../../Presentation/Stock/stock.controller';

describe('E2E Test Stock', () => {
  let controller: StockController;
  let healthController: HealthController;
  let service: StockService;
  let prisma: PrismaService;
  let healthService: PrismaHealthIndicator;
  let app: INestApplication;

  const mockTodoService = {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    markAsInActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [StockController, HealthController],
      providers: [
        PrismaHealthIndicator,
        StockService,
        PrismaService,
        ConfigService,
        { provide: StockRepository, useClass: StockAdapter },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockTodoService)
      .compile();

    controller = module.get<StockController>(StockController);
    healthController = module.get<HealthController>(HealthController);
    service = module.get(StockService);
    healthService = module.get(PrismaHealthIndicator);
    prisma = module.get(PrismaService);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(healthController).toBeDefined();
    expect(healthService).toBeDefined();
  });
});
