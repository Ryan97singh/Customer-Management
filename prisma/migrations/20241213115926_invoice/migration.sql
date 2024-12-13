-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
