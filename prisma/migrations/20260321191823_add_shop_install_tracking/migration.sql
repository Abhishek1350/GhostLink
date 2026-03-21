-- CreateTable
CREATE TABLE "Shop" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "uninstallCount" INTEGER NOT NULL DEFAULT 0,
    "isInstalled" BOOLEAN NOT NULL DEFAULT false,
    "firstInstalledAt" DATETIME,
    "lastInstalledAt" DATETIME,
    "lastUninstalledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShopInstallEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShopInstallEvent_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Shop" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ShopInstallEvent_shop_createdAt_idx" ON "ShopInstallEvent"("shop", "createdAt");
