import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../Application/services/products.service';
import { ProductsAdapter } from '../../Domain/Adapters/products.adapter';
import { ProductsRepository } from '../../Domain/Repositories/productsRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { HealthController } from '../../Presentation/Health/health.controller';
import { PrismaHealthIndicator } from '../../Presentation/Health/PrismaHealthIndicator.service';
import { ProductsController } from '../../Presentation/Products/products.controller';

describe('E2E Test Products', () => {
  let productsController: ProductsController;
  let healthController: HealthController;
  let service: ProductsService;
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
      controllers: [ProductsController, HealthController],
      providers: [
        PrismaHealthIndicator,
        ProductsService,
        PrismaService,
        ConfigService,
        { provide: ProductsRepository, useClass: ProductsAdapter },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockTodoService)
      .compile();

    productsController = module.get<ProductsController>(ProductsController);
    healthController = module.get<HealthController>(HealthController);
    service = module.get(ProductsService);
    healthService = module.get(PrismaHealthIndicator);
    prisma = module.get(PrismaService);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(healthController).toBeDefined();
    expect(healthService).toBeDefined();
  });
});
