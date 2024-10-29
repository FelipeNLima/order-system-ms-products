import { Injectable } from '@nestjs/common';
import { Stock, StockUpdate } from 'src/Domain/Interfaces/stock.interface';
import { StockRepository } from 'src/Domain/Repositories/stockRepository';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async getById(id: number): Promise<Stock | null> {
    return this.stockRepository.getStockById(id);
  }

  async getProductId(productID: number): Promise<Stock | null> {
    return this.stockRepository.getStockByProductId(productID);
  }

  async create(stock: Stock): Promise<Stock> {
    return this.stockRepository.saveStock(stock);
  }

  async update(stock: StockUpdate): Promise<Stock> {
    return this.stockRepository.updateStock(stock);
  }
}
