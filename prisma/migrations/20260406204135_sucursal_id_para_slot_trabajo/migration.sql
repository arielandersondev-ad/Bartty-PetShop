-- AlterTable
ALTER TABLE "SlotTrabajo" ADD COLUMN     "sucursalId" TEXT;

-- AddForeignKey
ALTER TABLE "SlotTrabajo" ADD CONSTRAINT "SlotTrabajo_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
