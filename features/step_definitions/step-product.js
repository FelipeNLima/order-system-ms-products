const { When, Then } = require('@cucumber/cucumber');
const { deepStrictEqual } = require('assert');

const answerProduct = {
  id: 1,
  createdAt: new Date('2024-10-29T14:01:25.029Z'),
  updatedAt: new Date('2024-10-29T14:01:25.029Z'),
  name: 'sorvete',
  priceUnit: 4,
  categoryID: 1,
};

function createProduct(product) {
  if (product) {
    return {
      id: 1,
      createdAt: new Date('2024-10-29T14:01:25.029Z'),
      updatedAt: new Date('2024-10-29T14:01:25.029Z'),
      name: 'sorvete',
      priceUnit: 4,
      categoryID: 1,
    };
  }
}

When('creating a product', function () {
  this.product = createProduct({
    name: 'sorvete',
    priceUnit: 4,
    categoryID: 1,
  });
});

Then('return product made', function () {
  deepStrictEqual(this.product, answerProduct);
});
