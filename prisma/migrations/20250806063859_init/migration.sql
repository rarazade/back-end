/*
  Warnings:

  - Added the required column `releaseDate` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
