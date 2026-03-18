-- CreateTable
CREATE TABLE "GhostLinkSettings" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "autoPilot" BOOLEAN NOT NULL DEFAULT false,
    "autoTarget" TEXT NOT NULL DEFAULT '/',
    "updatedAt" DATETIME NOT NULL
);
