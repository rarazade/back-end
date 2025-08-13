/*
  Warnings:

  - You are about to drop the `SystemRequirement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requirements` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."SystemRequirement" DROP CONSTRAINT "SystemRequirement_gameId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "requirements" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."SystemRequirement";
