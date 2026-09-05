/*
  Warnings:

  - Added the required column `title` to the `PricingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PricingPlan" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL;
