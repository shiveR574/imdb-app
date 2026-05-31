-- CreateTable
CREATE TABLE "ListEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rating" INTEGER,
    "note" TEXT,
    "watchedOn" TIMESTAMP(3),
    "addedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListEntry_userId_status_idx" ON "ListEntry"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ListEntry_userId_mediaId_key" ON "ListEntry"("userId", "mediaId");
