/*
  Warnings:

  - You are about to drop the column `autoRedirectToHome` on the `GhostLinkSettings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GhostLinkLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "referrer" TEXT,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GhostLinkLog" ("createdAt", "hitCount", "id", "path", "referrer", "shop", "status", "updatedAt", "url") SELECT "createdAt", "hitCount", "id", "path", "referrer", "shop", "status", "updatedAt", "url" FROM "GhostLinkLog";
DROP TABLE "GhostLinkLog";
ALTER TABLE "new_GhostLinkLog" RENAME TO "GhostLinkLog";
CREATE UNIQUE INDEX "GhostLinkLog_shop_path_key" ON "GhostLinkLog"("shop", "path");
CREATE TABLE "new_GhostLinkSettings" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "autoPilot" BOOLEAN NOT NULL DEFAULT false,
    "autoTarget" TEXT NOT NULL DEFAULT '/',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GhostLinkSettings" ("autoPilot", "autoTarget", "shop", "updatedAt") SELECT "autoPilot", "autoTarget", "shop", "updatedAt" FROM "GhostLinkSettings";
DROP TABLE "GhostLinkSettings";
ALTER TABLE "new_GhostLinkSettings" RENAME TO "GhostLinkSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
