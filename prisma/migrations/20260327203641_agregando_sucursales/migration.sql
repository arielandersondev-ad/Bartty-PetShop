/*
  Warnings:

  - A unique constraint covering the columns `[sucursalId,nombre]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "RolUsuario" ADD VALUE 'admin_global';

-- DropIndex
DROP INDEX "Categoria_nombre_key";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "Configuracion" ADD COLUMN     "recojoHabilitado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "Corte" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "Inventario" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "MovimientoInventario" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "UnidadMedida" ADD COLUMN     "sucursalId" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "sucursalId" TEXT;

-- CreateTable
CREATE TABLE "Sucursal" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_sucursalId_nombre_key" ON "Categoria"("sucursalId", "nombre");

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnidadMedida" ADD CONSTRAINT "UnidadMedida_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuracion" ADD CONSTRAINT "Configuracion_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corte" ADD CONSTRAINT "Corte_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
