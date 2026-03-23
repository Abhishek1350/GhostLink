-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'FIXED');

-- CreateEnum
CREATE TYPE "InstallationEventType" AS ENUM ('INSTALLED', 'UNINSTALLED');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GhostLinkLog" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "referrer" TEXT,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "status" "LinkStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GhostLinkLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GhostLinkSettings" (
    "shop" TEXT NOT NULL,
    "autoPilot" BOOLEAN NOT NULL DEFAULT false,
    "autoTarget" TEXT NOT NULL DEFAULT '/',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GhostLinkSettings_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "Shop" (
    "shop" TEXT NOT NULL,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "uninstallCount" INTEGER NOT NULL DEFAULT 0,
    "isInstalled" BOOLEAN NOT NULL DEFAULT false,
    "firstInstalledAt" TIMESTAMP(3),
    "lastInstalledAt" TIMESTAMP(3),
    "lastUninstalledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "ShopInstallEvent" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "type" "InstallationEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopInstallEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GhostLinkLog_shop_path_key" ON "GhostLinkLog"("shop", "path");

-- CreateIndex
CREATE INDEX "ShopInstallEvent_shop_createdAt_idx" ON "ShopInstallEvent"("shop", "createdAt");

-- AddForeignKey
ALTER TABLE "ShopInstallEvent" ADD CONSTRAINT "ShopInstallEvent_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Shop"("shop") ON DELETE RESTRICT ON UPDATE CASCADE;
