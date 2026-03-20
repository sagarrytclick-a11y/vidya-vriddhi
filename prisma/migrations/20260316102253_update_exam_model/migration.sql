/*
  Warnings:

  - Added the required column `conductingBody` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examMode` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examType` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('NATIONAL', 'STATE', 'UNIVERSITY', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "ExamMode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('ONCE_A_YEAR', 'TWICE_A_YEAR', 'QUARTERLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "College" ADD COLUMN     "admissionProcess" JSONB,
ADD COLUMN     "documentsRequired" JSONB,
ADD COLUMN     "establishment_year" INTEGER,
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "feesStructure" JSONB,
ADD COLUMN     "galleryImages" JSONB,
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "logoURL" TEXT,
ADD COLUMN     "ranking" INTEGER,
ADD COLUMN     "whyChooseUs" JSONB;

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "conductingBody" TEXT NOT NULL,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "examDates" JSONB,
ADD COLUMN     "examMode" "ExamMode" NOT NULL,
ADD COLUMN     "examPattern" JSONB,
ADD COLUMN     "examType" "ExamType" NOT NULL,
ADD COLUMN     "frequency" "Frequency" NOT NULL,
ADD COLUMN     "heroSection" JSONB,
ADD COLUMN     "overview" JSONB,
ADD COLUMN     "registration" JSONB,
ADD COLUMN     "resultStatistics" JSONB,
ADD COLUMN     "shortName" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "imageUrl" TEXT;
