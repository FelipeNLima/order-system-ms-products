import { prismaMock } from '../../../test/singleton';
import { Categories } from '../../Domain/Interfaces/categories';
import {
  deleteCategoriesById,
  getCategoriesById,
  getProductByCategoryID,
  saveCategories,
  updateCategories,
} from './mock/functionsCategories';

describe('Unit Test Categories', () => {
  it('should Create new categories ', async () => {
    const dto: Categories = { type: 'sobremesa' };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      type: 'sobremesa',
    };

    prismaMock.categories.create.mockResolvedValue(results);

    await expect(saveCategories(dto)).resolves.toEqual(results);
  });

  it('should Update new categories ', async () => {
    const dto: Categories = {
      id: 1,
      type: 'sobremesa',
    };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      type: 'sobremesa',
    };

    prismaMock.categories.update.mockResolvedValue(results);

    await expect(updateCategories(dto)).resolves.toEqual(results);
  });

  it('should Get categories by ID', async () => {
    const id = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      categoryID: 1,
      type: 'sobremesa',
    };

    prismaMock.categories.findUnique.mockResolvedValue(results);

    await expect(getCategoriesById(id)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      categoryID: 1,
      type: 'sobremesa',
    });
  });

  it('should Get categories by categoriesID', async () => {
    const categoryID = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      type: 'sobremesa',
    };

    prismaMock.categories.findFirst.mockResolvedValue(results);

    await expect(getProductByCategoryID(categoryID)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      type: 'sobremesa',
    });
  });

  it('should Delete categories by ID', async () => {
    const id = 1;
    const results = {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      type: 'sobremesa',
    };
    prismaMock.categories.delete.mockResolvedValue(results);

    await expect(deleteCategoriesById(id)).resolves.toEqual(results);
  });
});
