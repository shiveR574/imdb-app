/*
  Warnings:

  - You are about to drop the `MovieWatchlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvShowWatchlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FavoriteType" AS ENUM ('MOVIE', 'TVSHOW', 'PERSON');

-- DropTable
DROP TABLE "MovieWatchlist";

-- DropTable
DROP TABLE "TvShowWatchlist";

-- CreateTable
CREATE TABLE "movieWatchlist" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "movieId" TEXT NOT NULL,
    "movieName" TEXT,
    "status" "WatchStatus" NOT NULL DEFAULT 'PLAN_TO_WATCH',
    "userRating" INTEGER,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movieWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tvShowWatchlist" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tvshowId" TEXT NOT NULL,
    "tvshowName" TEXT,
    "status" "WatchStatus" NOT NULL DEFAULT 'PLAN_TO_WATCH',
    "email" TEXT,
    "userRating" INTEGER,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tvShowWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "type" "FavoriteType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movieWatchlist_userId_idx" ON "movieWatchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "movieWatchlist_userId_movieId_key" ON "movieWatchlist"("userId", "movieId");

-- CreateIndex
CREATE INDEX "tvShowWatchlist_userId_idx" ON "tvShowWatchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tvShowWatchlist_userId_tvshowId_key" ON "tvShowWatchlist"("userId", "tvshowId");

-- CreateIndex
CREATE INDEX "favorite_userId_idx" ON "favorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_userId_type_entityId_key" ON "favorite"("userId", "type", "entityId");
