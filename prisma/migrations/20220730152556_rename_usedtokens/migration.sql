/*
  Warnings:

  - You are about to drop the `UsedToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UsedToken";

-- CreateTable
CREATE TABLE "used_tokens" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "used_tokens_pkey" PRIMARY KEY ("id")
);
