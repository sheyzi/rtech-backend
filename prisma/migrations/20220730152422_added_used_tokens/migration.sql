-- CreateTable
CREATE TABLE "UsedToken" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsedToken_pkey" PRIMARY KEY ("id")
);
