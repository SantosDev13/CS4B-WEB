-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "mostrar_precio" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "precio" DECIMAL(10,2),
ADD COLUMN     "precio_anterior" DECIMAL(10,2),
ADD COLUMN     "tipo_moneda" TEXT NOT NULL DEFAULT 'PEN';
