-- DropForeignKey
ALTER TABLE "public"."GameCategory" DROP CONSTRAINT "GameCategory_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."GameCategory" ADD CONSTRAINT "GameCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
