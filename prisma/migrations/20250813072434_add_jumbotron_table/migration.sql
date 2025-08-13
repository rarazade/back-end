-- CreateTable
CREATE TABLE "public"."Jumbotron" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jumbotron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jumbotron_gameId_key" ON "public"."Jumbotron"("gameId");

-- AddForeignKey
ALTER TABLE "public"."Jumbotron" ADD CONSTRAINT "Jumbotron_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
