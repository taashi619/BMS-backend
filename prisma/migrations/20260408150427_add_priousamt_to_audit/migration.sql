-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "newFineAmount" DECIMAL(65,30),
ADD COLUMN     "previousFineAmount" DECIMAL(65,30);
