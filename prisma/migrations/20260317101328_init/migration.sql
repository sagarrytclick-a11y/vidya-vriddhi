/*
  Warnings:

  - Added the required column `updatedAt` to the `Enquiry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('PENDING', 'RESOLVED', 'FOLLOW_UP');

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "status" "EnquiryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
