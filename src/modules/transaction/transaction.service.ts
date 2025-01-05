import { HttpStatus, Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import {
  CreateTransactionData,
  FilterTransactionWhere,
  handleBudgetTransactionProcessingData,
  TransactionWhere,
  UpdateTransactionData,
  UploadAttachmentData,
} from './transaction.interface';
import { MediaRepository } from '@/helper/media/media.repository';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import { AwsS3Service } from '@/helper/media/services/aws-s3.service';
import { BudgetRepository } from '../budget/budget.repository';
import { BudgetTransactionRepository } from '../budget/repositories/budget-transaction.repository';
import { BudgetReportRepository } from '../budget/repositories/budget-report.repository';

@Injectable()
export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
    private budgetRepo: BudgetRepository,
    private budgetReportRepo: BudgetReportRepository,
    private budgetTransactionRepo: BudgetTransactionRepository,
    private mediaRepo: MediaRepository,
    private awsS3Service: AwsS3Service,
  ) {}

  private async validateAttachment(id: number) {
    const attachment = await this.mediaRepo.findOne({
      id,
    });
    if (!attachment) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        `Attachment does not exist by id ${id}`,
      );
    }
    if (attachment.entityId) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Attachment belongs to another transaction',
      );
    }
    return attachment;
  }

  private async handleBudgetTransactionProcessing(
    data: handleBudgetTransactionProcessingData,
  ) {
    const budgets = await this.budgetRepo.findActiveBudgetsByDate(
      data.userId,
      data.txCreatedAt,
      data.accountId,
      data.categoryId,
    );

    if (!budgets.length) return;

    for (let budget of budgets) {
      const budgetTx = await this.budgetTransactionRepo.create({
        budgetId: budget.id,
        reportId: budget.reportId,
        transactionId: data.txId,
        amount: data.txAmount,
      });

      const totalPeriodAmt =
        await this.budgetTransactionRepo.calTotalPeriodAmount(
          budgetTx.reportId,
        );

      const totalReportTx = await this.budgetTransactionRepo.calTotalReportTx(
        budgetTx.reportId,
      );

      await Promise.all([
        this.budgetReportRepo.update(budget.reportId, {
          amount: totalPeriodAmt,
          totalTransactions: totalReportTx,
        }),
        this.budgetRepo.updateById(budget.id, {
          spent: totalPeriodAmt,
        }),
      ]);
    }
  }

  async handleDeleteTransaction(data: handleBudgetTransactionProcessingData) {
    const budgetTxns = await this.budgetTransactionRepo.findManyAndDelete({
      transactionId: data.txId,
    });

    if (!budgetTxns.length) return;

    for (let budgetTxn of budgetTxns) {
      const totalPeriodAmt =
        await this.budgetTransactionRepo.calTotalPeriodAmount(
          budgetTxn.reportId,
        );

      const totalReportTx = await this.budgetTransactionRepo.calTotalReportTx(
        budgetTxn.reportId,
      );

      await Promise.all([
        this.budgetReportRepo.update(budgetTxn.reportId, {
          amount: totalPeriodAmt,
          totalTransactions: totalReportTx,
        }),
        this.budgetRepo.updateById(budgetTxn.budgetId, {
          spent: totalPeriodAmt,
        }),
      ]);
    }
  }

  async create(data: CreateTransactionData) {
    if (data.attachmentId) {
      await this.validateAttachment(data.attachmentId);
    }

    const transaction = await this.transactionRepo.create(data);

    if (data.attachmentId) {
      await this.mediaRepo.findByIdAndUpdate(data.attachmentId, {
        entityId: data.attachmentId,
        entityType: 'transaction',
      });
    }

    if (transaction.type === 'DEBIT') {
      await this.handleBudgetTransactionProcessing({
        ...data,
        txId: transaction.id,
        txAmount: +transaction.amount,
        txCreatedAt: transaction.createdAt,
      });
    }

    return transaction;
  }

  async update(where: TransactionWhere, data: UpdateTransactionData) {
    if (!data.attachmentId) {
      delete data?.attachmentId;
    }
    if (data.attachmentId) {
      const attachment = await this.validateAttachment(data.attachmentId);
      await this.mediaRepo.findByIdAndUpdate(attachment.id, {
        entityId: where.id,
        entityType: 'transaction',
      });
    }
    const Transaction = await this.transactionRepo.findOneAndUpdate(
      where,
      data,
    );
    if (!Transaction) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Transaction not found');
    }
    return Transaction;
  }

  async delete(where: TransactionWhere) {
    const transaction = await this.transactionRepo.findOneAndDelete(where);

    if (!transaction) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Transaction not found');
    }

    await this.handleDeleteTransaction({
      accountId: transaction.accountId,
      categoryId: transaction.category.id,
      txAmount: +transaction.amount,
      txCreatedAt: transaction.createdAt,
      txId: transaction.id,
      userId: where.userId,
    });

    return transaction;
  }

  async findMany(where?: FilterTransactionWhere) {
    const transactions = await this.transactionRepo.findMany(where);
    return transactions;
  }

  async uploadAttachment(data: UploadAttachmentData) {
    const name = this.awsS3Service.getObjectKey(
      data.image.originalname,
      'png',
      'transactions',
    );
    const path = this.awsS3Service.getObjectUrl(name);
    const [attachment] = await Promise.all([
      this.mediaRepo.create({
        name: data.image.originalname,
        path: path,
        size: data.image.size,
        mime: data.image.mimetype,
        userId: data.userId,
      }),
      this.awsS3Service.upload(data.image.buffer, name, data.image.mimetype),
    ]);
    return attachment;
  }
}
