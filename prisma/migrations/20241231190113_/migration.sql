/*
  Warnings:

  - You are about to drop the column `account_id` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `budgets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_account_id_fkey";

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_category_id_fkey";

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "account_id",
DROP COLUMN "category_id",
ADD COLUMN     "account_ids" INTEGER[],
ADD COLUMN     "category_ids" INTEGER[],
ADD COLUMN     "period_no" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "report_id" INTEGER;

-- CreateTable
CREATE TABLE "budget_transactions" (
    "id" SERIAL NOT NULL,
    "budget_id" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_reports" (
    "id" SERIAL NOT NULL,
    "budget_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "period_no" INTEGER NOT NULL,
    "period_start_date" TIMESTAMP(3) NOT NULL,
    "period_end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountToBudget" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AccountToBudget_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BudgetToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BudgetToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AccountToBudget_B_index" ON "_AccountToBudget"("B");

-- CreateIndex
CREATE INDEX "_BudgetToCategory_B_index" ON "_BudgetToCategory"("B");

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "budget_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_transactions" ADD CONSTRAINT "budget_transactions_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_transactions" ADD CONSTRAINT "budget_transactions_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_transactions" ADD CONSTRAINT "budget_transactions_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "budget_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToBudget" ADD CONSTRAINT "_AccountToBudget_A_fkey" FOREIGN KEY ("A") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToBudget" ADD CONSTRAINT "_AccountToBudget_B_fkey" FOREIGN KEY ("B") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToCategory" ADD CONSTRAINT "_BudgetToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToCategory" ADD CONSTRAINT "_BudgetToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
