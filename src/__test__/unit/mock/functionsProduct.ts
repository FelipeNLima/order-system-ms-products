import { Products } from '../../../Domain/Interfaces/products';
import prisma from '../../../../test/client';

export async function getProductsById(id: number): Promise<Products | null> {
  try {
    return await prisma.products.findUnique({ where: { id: id } });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function saveProducts(products: Products): Promise<Products> {
  try {
    return await prisma.products.create({ data: products });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function updateProducts(products: Products): Promise<Products> {
  try {
    return await prisma.products.update({
      where: {
        id: products.id,
      },
      data: products,
    });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function deleteProductsById(id: number): Promise<Products> {
  try {
    return await prisma.products.delete({ where: { id: id } });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}
