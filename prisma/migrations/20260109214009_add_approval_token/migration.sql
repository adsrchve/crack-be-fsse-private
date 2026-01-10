/*
  Warnings:

  - A unique constraint covering the columns `[approvalToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approvalToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_approvalToken_key" ON "User"("approvalToken");
