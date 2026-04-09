-- CreateTable
CREATE TABLE "Configuracion" (
    "id" SERIAL NOT NULL,
    "clientesPorHora" INTEGER NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotTrabajo" (
    "id" SERIAL NOT NULL,
    "hora" TEXT NOT NULL,
    "configuracionId" INTEGER NOT NULL,

    CONSTRAINT "SlotTrabajo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlotTrabajo" ADD CONSTRAINT "SlotTrabajo_configuracionId_fkey" FOREIGN KEY ("configuracionId") REFERENCES "Configuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
