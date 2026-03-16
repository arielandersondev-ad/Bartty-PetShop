-- CreateTable
CREATE TABLE "Corte" (
    "id" SERIAL NOT NULL,
    "ruta" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Corte_pkey" PRIMARY KEY ("id")
);
