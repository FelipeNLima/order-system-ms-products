import { Stock, StockUpdate } from '../../../Domain/Interfaces/stock.interface';
import prisma from '../../client';

export async function getStockById(id: number): Promise<Stock | null> {
  try {
    return await prisma.stock.findUnique({ where: { id: id } });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function getStockByProductId(
  productID: number,
): Promise<Stock | null> {
  try {
    return await prisma.stock.findFirst({
      where: { productID: productID },
    });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function saveStock(stock: Stock): Promise<Stock> {
  try {
    return await prisma.stock.create({ data: stock });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function updateStock(stock: StockUpdate): Promise<Stock> {
  try {
    // BUSCA REGISTRO ESTOQUE
    const stockData = await prisma.stock.findFirst({
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
      return await prisma.stock.update({
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
