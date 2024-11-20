/*
  Warnings:

  - A unique constraint covering the columns `[productID]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Stock_productID_key` ON `Stock`(`productID`);
