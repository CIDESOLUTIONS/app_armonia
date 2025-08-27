/*
  Warnings:

  - The `priority` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('REGULATION', 'MINUTES', 'MANUAL', 'CONTRACT', 'INVOICE', 'REPORT', 'CERTIFICATE', 'BUDGET', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "public"."Document" DROP COLUMN "type",
ADD COLUMN     "type" "public"."DocumentType" NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "public"."Priority";

-- CreateIndex
CREATE INDEX "Document_residentialComplexId_type_idx" ON "public"."Document"("residentialComplexId", "type");
