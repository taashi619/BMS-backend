/*
  Warnings:

  - The `status` column on the `Bicycle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BicycleStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE');

-- AlterTable
ALTER TABLE "Bicycle" DROP COLUMN "status",
ADD COLUMN     "status" "BicycleStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
