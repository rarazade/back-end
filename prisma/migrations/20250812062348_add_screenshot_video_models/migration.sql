-- CreateTable
CREATE TABLE "public"."Screenshot" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VideoSlider" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "VideoSlider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Screenshot" ADD CONSTRAINT "Screenshot_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoSlider" ADD CONSTRAINT "VideoSlider_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
