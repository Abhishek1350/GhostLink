-- CreateTable
CREATE TABLE "GhostLinkLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "referrer" TEXT,
    "hitCount" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GhostLinkLog_shop_url_key" ON "GhostLinkLog"("shop", "url");
