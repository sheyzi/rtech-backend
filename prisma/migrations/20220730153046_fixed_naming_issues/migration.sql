/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailConfirmed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneNoConfirmed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNo` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_phoneNo_idx";

-- DropIndex
DROP INDEX "users_email_phoneNo_key";

-- DropIndex
DROP INDEX "users_phoneNo_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "isActive",
DROP COLUMN "isEmailConfirmed",
DROP COLUMN "isPhoneNoConfirmed",
DROP COLUMN "lastName",
DROP COLUMN "phoneNo",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_email_confirmed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_phone_number_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_email_phone_number_idx" ON "users"("email", "phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_phone_number_key" ON "users"("email", "phone_number");
