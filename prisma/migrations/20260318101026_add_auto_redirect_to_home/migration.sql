-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GhostLinkSettings" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "autoPilot" BOOLEAN NOT NULL DEFAULT false,
    "autoRedirectToHome" BOOLEAN NOT NULL DEFAULT false,
    "autoTarget" TEXT NOT NULL DEFAULT '/',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GhostLinkSettings" ("autoPilot", "autoTarget", "shop", "updatedAt") SELECT "autoPilot", "autoTarget", "shop", "updatedAt" FROM "GhostLinkSettings";
DROP TABLE "GhostLinkSettings";
ALTER TABLE "new_GhostLinkSettings" RENAME TO "GhostLinkSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
