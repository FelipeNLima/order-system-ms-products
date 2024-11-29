import { Products } from '../../Domain/Interfaces/products';
import { prismaMock } from '../singleton';
import {
  deleteProductsById,
  getProductsById,
  saveProducts,
  updateProducts,
} from './mock/functionsProduct';

describe('Unit Test Products', () => {
  it('should Create new products ', async () => {
    const dto: Products = {
      name: 'sorvete',
      priceUnit: 4,
      categoryID: 1,
    };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 4,
      categoryID: 1,
    };

    prismaMock.products.create.mockResolvedValue(results);

    await expect(saveProducts(dto)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 4,
      categoryID: 1,
    });
  });

  it('should Update new products ', async () => {
    const dto: Products = {
      id: 1,
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    prismaMock.products.update.mockResolvedValue(results);

    await expect(updateProducts(dto)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    });
  });

  it('should Get products by ID', async () => {
    const id = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };

    prismaMock.products.findUnique.mockResolvedValue(results);

    await expect(getProductsById(id)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    });
  });

  it('should Delete products by ID', async () => {
    const id = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 5,
      categoryID: 1,
    };
    prismaMock.products.delete.mockResolvedValue(results);

    await expect(deleteProductsById(id)).resolves.toEqual(results);
  });
});
