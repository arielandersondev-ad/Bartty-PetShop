/*
  Warnings:

  - The primary key for the `Inventario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Inventario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
-- habilita función uuid (elige una de estas según tu Postgres)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- o: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- agregar id con default de base de datos
ALTER TABLE "Inventario" ADD COLUMN "id" uuid DEFAULT gen_random_uuid();

-- si existe PK previa basada en productoId, elimínala
ALTER TABLE "Inventario" DROP CONSTRAINT IF EXISTS "Inventario_pkey";

-- si existe unique en productoId, elimínalo
ALTER TABLE "Inventario" DROP CONSTRAINT IF EXISTS "Inventario_productoId_key";

-- hacer id NOT NULL y asignar nueva PK
ALTER TABLE "Inventario" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id");