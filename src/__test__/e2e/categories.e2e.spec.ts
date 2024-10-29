import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../Application/services/categories.service';
import { CategoriesAdapter } from '../../Domain/Adapters/categories.adapter';
import { CategoriesRepository } from '../../Domain/Repositories/categoriesRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { CategoriesController } from '../../Presentation/Categories/categories.controller';
import { HealthController } from '../../Presentation/Health/health.controller';
import { PrismaHealthIndicator } from '../../Presentation/Health/PrismaHealthIndicator.service';

describe('E2E Test Categories', () => {
  let controller: CategoriesController;
  let healthController: HealthController;
  let service: CategoriesService;
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
      controllers: [CategoriesController, HealthController],
      providers: [
        PrismaHealthIndicator,
        CategoriesService,
        PrismaService,
        ConfigService,
        { provide: CategoriesRepository, useClass: CategoriesAdapter },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockTodoService)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    healthController = module.get<HealthController>(HealthController);
    service = module.get(CategoriesService);
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
