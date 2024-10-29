import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './Infrastructure/Apis/prisma.service';
import { RolesGuard } from './Infrastructure/Guard/roles.guard';
import { CategoriesModule } from './Presentation/Categories/categories.module';
import { HealthModule } from './Presentation/Health/health.module';
import { ProductsModule } from './Presentation/Products/products.module';
import { StockModule } from './Presentation/Stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    HealthModule,
    StockModule,
    CategoriesModule,
    ProductsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
  controllers: [],
})
export class AppModule {}
