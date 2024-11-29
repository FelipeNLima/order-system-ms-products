import { Stock } from '../../Domain/Interfaces/stock.interface';
import { prismaMock } from '../singleton';
import {
  getStockById,
  getStockByProductId,
  saveStock,
  updateStock,
} from './mock/functionsStock';

describe('Unit Test Stock', () => {
  it('should Create new stock ', async () => {
    const dto: Stock = {
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    };

    prismaMock.stock.create.mockResolvedValue(results);

    await expect(saveStock(dto)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    });
  });

  it('should Update new stock ', async () => {
    const dto: Stock = {
      id: 1,
      quantity: 100,
      quantityAvailable: 98,
      productID: 1,
    };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 98,
      productID: 1,
    };

    prismaMock.stock.findFirst.mockResolvedValue({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    });
    prismaMock.stock.update.mockResolvedValue(results);

    await expect(updateStock(dto)).resolves.toEqual(results);
  });

  it('should Get stock by ID', async () => {
    const id = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    };

    prismaMock.stock.findUnique.mockResolvedValue(results);

    await expect(getStockById(id)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    });
  });

  it('should Get stock by productID', async () => {
    const productID = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    };

    prismaMock.stock.findFirst.mockResolvedValue(results);

    await expect(getStockByProductId(productID)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    });
  });
});
