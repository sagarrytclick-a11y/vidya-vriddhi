/*
  Warnings:

  - You are about to drop the column `galleryImages` on the `College` table. All the data in the column will be lost.
  - You are about to drop the column `ranking` on the `College` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "College" DROP COLUMN "galleryImages",
DROP COLUMN "ranking",
ADD COLUMN     "Countryranking" INTEGER,
ADD COLUMN     "Internationalranking" INTEGER,
ADD COLUMN     "campusHighlights" JSONB,
ADD COLUMN     "keyHighlights" JSONB;
