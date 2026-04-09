/*
  Warnings:

  - The primary key for the `Inventario` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Inventario" DROP CONSTRAINT "Inventario_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id");
