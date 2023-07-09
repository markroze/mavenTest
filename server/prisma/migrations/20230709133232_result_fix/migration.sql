/*
  Warnings:

  - You are about to drop the column `result` on the `GameResults` table. All the data in the column will be lost.
  - Added the required column `score` to the `GameResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameResults" DROP COLUMN "result",
ADD COLUMN     "score" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GameResults_userId_idx" ON "GameResults"("userId");
