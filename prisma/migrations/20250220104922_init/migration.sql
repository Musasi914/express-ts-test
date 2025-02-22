/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "age" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Campgrounds" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Campgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
