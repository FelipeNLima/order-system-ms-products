export interface Stock {
  id: number;
  quantity: number;
  quantityAvailable: number;
  productID: number;
}

export interface StockUpdate {
  quantity: number;
  productID: number;
}
