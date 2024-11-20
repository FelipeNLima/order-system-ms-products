import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { Stock, StockUpdate } from '../Interfaces/stock.interface';
import { StockRepository } from '../Repositories/stockRepository';

@Injectable()
export class StockAdapter implements StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStockById(id: number): Promise<Stock | null> {
    try {
      return await this.prisma.stock.findUnique({ where: { id: id } });
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new Error(message);
    }
  }

  async getStockByProductId(productID: number): Promise<Stock | null> {
    try {
      return await this.prisma.stock.findFirst({
        where: { productID: productID },
      });
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new Error(message);
    }
  }

  async saveStock(stock: Stock): Promise<Stock> {
    try {
      return await this.prisma.stock.create({ data: stock });
    } catch (error) {
      const message =
        error?.message || error?.meta?.target || error?.meta?.details;
      throw new Error(message);
    }
  }

  async updateStock(stock: StockUpdate): Promise<Stock> {
    try {
      // BUSCA REGISTRO ESTOQUE
      const stockData = await this.prisma.stock.findFirst({
        where: { productID: stock?.productID },
      });

      if (stockData) {
        // RETIRA A QUANTIDADE UTILIZADA
        const newData = {
          ...stockData,
          quantityAvailable:
            Number(stockData?.quantityAvailable) - Number(stock?.quantity),
        };

        // ATUALIZA O ESTOQUE
        return await this.prisma.stock.update({
          where: {
            id: newData.id,
          },
          data: newData,
        });
      } else {
        throw new Error('Produto não encontrado na base de dados');
      }
    } catch (error) {
      const message =
        error?.meta?.target || error?.meta?.details || error?.message;
      throw new Error(message);
    }
  }
}
