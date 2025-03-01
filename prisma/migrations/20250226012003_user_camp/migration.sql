/*
  Warnings:

  - Added the required column `userId` to the `Campgrounds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campgrounds" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Campgrounds" ADD CONSTRAINT "Campgrounds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
