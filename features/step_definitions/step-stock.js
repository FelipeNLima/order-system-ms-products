const { When, Then } = require('@cucumber/cucumber');
const { deepStrictEqual } = require('assert');

const answerStock = {
  id: 1,
  createdAt: new Date('2024-10-29T14:01:25.029Z'),
  updatedAt: new Date('2024-10-29T14:01:25.029Z'),
  quantity: 100,
  quantityAvailable: 100,
  productID: 1,
};

function createStock(stock) {
  if (stock) {
    return {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      quantity: 100,
      quantityAvailable: 100,
      productID: 1,
    };
  }
}

When('creating a stock', function () {
  this.stock = createStock({
    quantity: 100,
    quantityAvailable: 100,
    productID: 1,
  });
});

Then('return stock made', function () {
  deepStrictEqual(this.stock, answerStock);
});
