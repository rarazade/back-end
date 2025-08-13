-- CreateTable
CREATE TABLE "public"."SystemRequirement" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "processor" TEXT NOT NULL,
    "memory" TEXT NOT NULL,
    "graphics" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "additionalNotes" TEXT,

    CONSTRAINT "SystemRequirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SystemRequirement" ADD CONSTRAINT "SystemRequirement_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
