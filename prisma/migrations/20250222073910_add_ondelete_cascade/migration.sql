-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_postId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Campgrounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
