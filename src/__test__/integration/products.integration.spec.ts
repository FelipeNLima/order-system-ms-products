import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';
import mysql, { Connection } from 'mysql2';
import request from 'supertest';
import { ProductsService } from '../../Application/services/products.service';
import { ProductsAdapter } from '../../Domain/Adapters/products.adapter';
import { Products } from '../../Domain/Interfaces/products';
import { ProductsRepository } from '../../Domain/Repositories/productsRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { HealthController } from '../../Presentation/Health/health.controller';
import { ProductsController } from '../../Presentation/Products/products.controller';

let container: StartedMySqlContainer; // importamos do pacote testcontainers/mysql
let prismaClient: PrismaClient; // importamos do Prisma Client
let app: INestApplication; // importamos nestjs common
let urlConnection: string; // a url do banco que sera criada pelo testcontainers
let client: Connection; // importamos do pacote mysql

beforeAll(async () => {
  jest.setTimeout(5000);
  container = await new MySqlContainer().start();
  client = mysql.createConnection({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getRootPassword(),
    database: container.getDatabase(),
    connectTimeout: 20000,
  });

  console.log(client);
  client.connect();
  process.env.DATABASE_URL = container.getConnectionUri();
  urlConnection = process.env.DATABASE_URL;

  // create a new instance of PrismaClient with the connection string
  console.log(urlConnection);
  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: urlConnection,
      },
    },
  });

  // drop schema and create a new one
  execSync(`npx prisma migrate reset --force`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
  // execSync(`npx prisma generate`, {
  //   env: {
  //     ...process.env,
  //     DATABASE_URL: urlConnection,
  //   },
  // });
  execSync(`npx prisma migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });

  // start the nestjs application
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
  }).compile();

  app = module.createNestApplication();
  await app.init();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Integration Test Products', () => {
  it('should create product', async () => {
    const dto: Products = {
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    await request(app.getHttpServer()).post('/products').send(dto).expect(201);

    const productDb = await prismaClient.products.findUnique({
      where: {
        id: 1,
      },
    });

    expect(productDb).toBeTruthy();
    expect(productDb?.categoryID).toBe(dto.categoryID);
    expect(productDb?.createdAt).toBeTruthy();
  });

  it('should update product', async () => {
    const product = {
      id: 1,
      name: 'sorvete',
      priceUnit: 10,
      categoryID: 1,
    };

    await request(app.getHttpServer())
      .patch('/products')
      .send(product)
      .expect(200);

    const productDb = await prismaClient.products.findUnique({
      where: {
        id: 1,
      },
    });

    expect(productDb).toBeTruthy();
    expect(productDb?.name).toBe(product.name);
    expect(productDb?.priceUnit).toBe(product.priceUnit);
  });

  it('should Get product by id', async () => {
    const id = 1;

    await request(app.getHttpServer()).get(`/products/${id}`).expect(200);

    const paymentDb = await prismaClient.products.findUnique({
      where: {
        id: 1,
      },
    });

    expect(paymentDb).toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    });
  });

  it('should Delete product by ID', async () => {
    const id = 1;

    await request(app.getHttpServer()).delete(`/products/${id}`).expect(200);

    const productDb = await prismaClient.products.findFirst({
      where: {
        id,
      },
    });

    expect(productDb).toEqual(200);
  });
});

// afterAll(async () => {
//   //await prismaClient.$disconnect();
//   client.destroy();
//   await container.stop();
// });
