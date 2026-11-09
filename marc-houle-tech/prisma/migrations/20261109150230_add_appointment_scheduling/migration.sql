-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'OPEN';
ALTER TYPE "OrderStatus" ADD VALUE 'PLANNED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "appointmentNotes" TEXT,
ADD COLUMN     "confirmationSentAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_scheduledAt_idx" ON "Order"("scheduledAt");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
