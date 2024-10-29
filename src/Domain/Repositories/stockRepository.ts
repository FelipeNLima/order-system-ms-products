import { Stock, StockUpdate } from '../Interfaces/stock.interface';

export abstract class StockRepository {
  abstract getStockById(id: number): Promise<Stock | null>;
  abstract getStockByProductId(productID: number): Promise<Stock | null>;
  abstract saveStock(stock: Stock): Promise<Stock>;
  abstract updateStock(stock: StockUpdate): Promise<Stock>;
}
