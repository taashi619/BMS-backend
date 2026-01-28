/*
  Warnings:

  - You are about to drop the column `status` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "status",
ADD COLUMN     "isResidential" BOOLEAN NOT NULL DEFAULT true;
