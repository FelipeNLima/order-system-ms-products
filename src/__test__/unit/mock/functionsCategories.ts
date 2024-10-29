import prisma from '../../../../test/client';
import { Categories } from '../../../Domain/Interfaces/categories';
import { ProductsByCategory } from '../../../Domain/Interfaces/productsByCategory';

export async function getCategoriesById(
  id: number,
): Promise<Categories | null> {
  try {
    return await prisma.categories.findUnique({ where: { id } });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function getProductByCategoryID(
  categoryID: number,
): Promise<ProductsByCategory | null> {
  try {
    return await prisma.categories.findFirst({
      where: { id: categoryID },
      select: { Products: true },
    });
  } catch (error) {
    const message =
      error?.message || error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function saveCategories(
  categories: Categories,
): Promise<Categories> {
  try {
    return await prisma.categories.create({ data: categories });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function updateCategories(
  category: Categories,
): Promise<Categories> {
  try {
    return await prisma.categories.update({
      where: {
        id: category.id,
      },
      data: category,
    });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function deleteCategoriesById(id: number): Promise<Categories> {
  try {
    return await prisma.categories.delete({ where: { id } });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}
