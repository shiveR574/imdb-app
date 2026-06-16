/*
  Warnings:

  - You are about to drop the `Watchlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "WatchStatus" ADD VALUE 'ON_HOLD';

-- DropTable
DROP TABLE "Watchlist";

-- CreateTable
CREATE TABLE "MovieWatchlist" (
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

    CONSTRAINT "MovieWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvShowWatchlist" (
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

    CONSTRAINT "TvShowWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovieWatchlist_userId_idx" ON "MovieWatchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieWatchlist_userId_movieId_key" ON "MovieWatchlist"("userId", "movieId");

-- CreateIndex
CREATE INDEX "TvShowWatchlist_userId_idx" ON "TvShowWatchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TvShowWatchlist_userId_tvshowId_key" ON "TvShowWatchlist"("userId", "tvshowId");
