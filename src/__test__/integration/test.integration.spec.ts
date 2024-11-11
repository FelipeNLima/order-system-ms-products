import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';
import { Connection, createConnection } from 'mysql2';
import * as request from 'supertest';
import { CategoriesService } from '../../Application/services/categories.service';
import { ProductsService } from '../../Application/services/products.service';
import { StockService } from '../../Application/services/stock.service';
import { CategoriesAdapter } from '../../Domain/Adapters/categories.adapter';
import { ProductsAdapter } from '../../Domain/Adapters/products.adapter';
import { StockAdapter } from '../../Domain/Adapters/stock.adapter';
import { Categories } from '../../Domain/Interfaces/categories';
import { Products } from '../../Domain/Interfaces/products';
import { Stock } from '../../Domain/Interfaces/stock.interface';
import { CategoriesRepository } from '../../Domain/Repositories/categoriesRepository';
import { ProductsRepository } from '../../Domain/Repositories/productsRepository';
import { StockRepository } from '../../Domain/Repositories/stockRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { CategoriesController } from '../../Presentation/Categories/categories.controller';
import { HealthController } from '../../Presentation/Health/health.controller';
import { PrismaHealthIndicator } from '../../Presentation/Health/PrismaHealthIndicator.service';
import { ProductsController } from '../../Presentation/Products/products.controller';
import { StockController } from '../../Presentation/Stock/stock.controller';

let container: StartedMySqlContainer; // importamos do pacote testcontainers/mysql
let prismaClient: PrismaClient; // importamos do Prisma Client
let app: INestApplication; // importamos nestjs common
let urlConnection: string; // a url do banco que sera criada pelo testcontainers
let client: Connection; // importamos do pacote mysql
let controllerProducts: ProductsController;
let controllerCategories: CategoriesController;
let controllerStock: StockController;

beforeAll(async () => {
  jest.setTimeout(5000);
  container = await new MySqlContainer().start();
  client = createConnection({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getRootPassword(),
    database: container.getDatabase(),
    connectTimeout: 20000,
  });

  client.connect();
  process.env.DATABASE_URL = container.getConnectionUri();
  urlConnection = process.env.DATABASE_URL;

  // create a new instance of PrismaClient with the connection string
  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: urlConnection,
      },
    },
  });

  // start the nestjs application
  const module: TestingModule = await Test.createTestingModule({
    imports: [HttpModule],
    controllers: [
      HealthController,
      ProductsController,
      CategoriesController,
      StockController,
    ],
    providers: [
      PrismaHealthIndicator,
      ProductsService,
      CategoriesService,
      StockService,
      PrismaService,
      ConfigService,
      { provide: ProductsRepository, useClass: ProductsAdapter },
      { provide: CategoriesRepository, useClass: CategoriesAdapter },
      { provide: StockRepository, useClass: StockAdapter },
    ],
  }).compile();

  controllerProducts = module.get<ProductsController>(ProductsController);
  controllerCategories = module.get<CategoriesController>(CategoriesController);
  controllerStock = module.get<StockController>(StockController);
  app = module.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await prismaClient.$disconnect();
  client.destroy();
  await container.stop();
  console.log('test db stopped...');
});

beforeEach(async () => {
  // drop schema and create a new one
  execSync(`npx prisma migrate reset --force`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
  execSync(`npx prisma migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Integration Test Products', () => {
  beforeEach(async () => {
    const dtoCategories: Categories = { type: 'sobremesa' };

    await request(app.getHttpServer())
      .post('/categories')
      .send(dtoCategories)
      .expect(201);
  });

  it('should create product', async () => {
    const dto: Products = {
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    await request(app.getHttpServer()).post('/products').send(dto).expect(201);

    const productDb = await controllerProducts.getByID(1);

    expect(productDb).toBeTruthy();
    expect(productDb?.categoryID).toBe(dto.categoryID);
  });

  it('should update product', async () => {
    const dto: Products = {
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    await request(app.getHttpServer()).post('/products').send(dto).expect(201);

    const product: Products = {
      id: 1,
      name: 'sorvete',
      priceUnit: 10,
      categoryID: 1,
    };

    await request(app.getHttpServer())
      .patch('/products')
      .send(product)
      .expect(200);

    const productDb = await controllerProducts.getByID(1);

    expect(productDb).toBeTruthy();
    expect(productDb?.name).toBe(product.name);
    expect(productDb?.priceUnit).toBe(product.priceUnit);
  });

  it('should Get product by id', async () => {
    const dto: Products = {
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    await request(app.getHttpServer()).post('/products').send(dto).expect(201);

    const id = 1;

    await request(app.getHttpServer()).get(`/products/${id}`).expect(200);

    const productDb = await controllerProducts.getByID(1);

    expect(productDb).toBeTruthy();
  });

  it('should Delete product by ID', async () => {
    const dto: Products = {
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    await request(app.getHttpServer()).post('/products').send(dto).expect(201);

    const id = 1;

    await request(app.getHttpServer()).delete(`/products/${id}`).expect(200);

    const productDb = await controllerProducts.getByID(id);

    expect(productDb).toBeNull();
  });
});

describe('Integration Test Categories', () => {
  it('should create categories', async () => {
    const dto: Categories = { type: 'sobremesa' };

    await request(app.getHttpServer())
      .post('/categories')
      .send(dto)
      .expect(201);

    const responseDb = await controllerCategories.getCategoriesByID(1);

    expect(responseDb).toBeTruthy();
    expect(responseDb?.type).toBe(dto.type);
  });

  it('should update categories', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ type: 'sobremesa' })
      .expect(201);

    const dto: Categories = {
      id: 1,
      type: 'sobremesa',
    };

    await request(app.getHttpServer())
      .patch('/categories')
      .send(dto)
      .expect(200);

    const responseDb = await controllerCategories.getCategoriesByID(1);

    expect(responseDb).toBeTruthy();
    expect(responseDb?.id).toBe(dto.id);
    expect(responseDb?.type).toBe(dto.type);
  });

  it('should Get categories by id', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ type: 'sobremesa' })
      .expect(201);

    const id = 1;

    await request(app.getHttpServer()).get(`/categories/${id}`).expect(200);

    const responseDb = await controllerCategories.getCategoriesByID(id);

    expect(responseDb).toBeTruthy();
    expect(responseDb?.id).toBe(id);
  });

  it('should Delete categories by ID', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ type: 'sobremesa' })
      .expect(201);

    const id = 1;

    await request(app.getHttpServer()).delete(`/categories/${id}`).expect(200);

    const responseDb = await controllerCategories.getCategoriesByID(1);

    expect(responseDb).toBeNull();
  });
});

describe('Integration Test Stock', () => {
  it('should create stock', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ type: 'sobremesa' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'sorvete',
        priceUnit: 5,
        categoryID: 1,
      })
      .expect(201);

    const dto: Stock = {
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    };

    await request(app.getHttpServer()).post('/stock').send(dto).expect(201);

    const responseDb = await controllerStock.getByID(1);

    expect(responseDb).toBeTruthy();
    expect(responseDb?.quantity).toBe(dto.quantity);
    expect(responseDb?.quantityAvailable).toBe(dto.quantityAvailable);
  });

  it('should update stock', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ type: 'sobremesa' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'sorvete',
        priceUnit: 5,
        categoryID: 1,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/stock')
      .send({
        quantity: 100,
        quantityAvailable: 100,
        productID: 1,
      })
      .expect(201);

    const dto = {
      quantity: 2,
      productID: 1,
    };

    await request(app.getHttpServer()).patch('/stock').send(dto).expect(200);

    const responseDb = await controllerStock.getByID(1);

    expect(responseDb).toBeTruthy();
    expect(responseDb?.quantityAvailable).toBe(98);
  });

  it('should Get stock by id', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ type: 'sobremesa' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'sorvete',
        priceUnit: 5,
        categoryID: 1,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/stock')
      .send({
        quantity: 100,
        quantityAvailable: 100,
        productID: 1,
      })
      .expect(201);

    const id = 1;

    await request(app.getHttpServer()).get(`/stock/${id}`).expect(200);

    const responseDb = await controllerStock.getByID(1);

    expect(responseDb).toBeTruthy();
    expect(responseDb?.id).toBe(id);
  });
});

afterAll(async () => {
  await prismaClient.$disconnect();
  await container.stop();
  client.destroy();
  console.log('test db stopped...');
});
