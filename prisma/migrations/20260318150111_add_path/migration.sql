/*
  Warnings:

  - Added the required column `path` to the `GhostLinkLog` table without a default value. This is not possible if the table is not empty.

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
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GhostLinkLog" ("createdAt", "hitCount", "id", "referrer", "shop", "status", "updatedAt", "url") SELECT "createdAt", "hitCount", "id", "referrer", "shop", "status", "updatedAt", "url" FROM "GhostLinkLog";
DROP TABLE "GhostLinkLog";
ALTER TABLE "new_GhostLinkLog" RENAME TO "GhostLinkLog";
CREATE UNIQUE INDEX "GhostLinkLog_shop_path_key" ON "GhostLinkLog"("shop", "path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
