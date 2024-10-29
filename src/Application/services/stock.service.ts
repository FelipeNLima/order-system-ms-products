import { Injectable } from '@nestjs/common';
import { StockRepository } from '../../Domain/Repositories/stockRepository';
import { Stock, StockUpdate } from '../../Domain/Interfaces/stock.interface';

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
