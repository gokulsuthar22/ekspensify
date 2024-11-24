import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import {
  CreateTransactionData,
  FilterTransactionWhere,
  TransactionWhere,
  UpdateTransactionData,
} from './transaction.interface';
import { MediaRepository } from 'helper/media/media.repository';

@Injectable()
export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
    private mediaRepository: MediaRepository,
  ) {}

  async create(data: CreateTransactionData) {
    const sample = {
      small: 'http://budget-buddy.s3/attachment-150x150.jpeg',
      medium: 'http://budget-buddy.s3/attachment-500x500.jpeg',
      large: 'http://budget-buddy.s3/attachment-720x720.jpeg',
    };

    const attachment = await this.mediaRepository.create({
      name: 'attachment',
      path: sample.large,
      ...sample,
      type: 'IMAGE',
    });

    return this.transactionRepo.create({
      ...data,
      attachmentId: attachment.id,
    });
  }

  async update(where: TransactionWhere, data: UpdateTransactionData) {
    const Transaction = await this.transactionRepo.findOneAndUpdate(
      where,
      data,
    );
    if (!Transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return Transaction;
  }

  async delete(where: TransactionWhere) {
    const Transaction = await this.transactionRepo.findOneAndDelete(where);
    if (!Transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return Transaction;
  }

  async findMany(where?: FilterTransactionWhere) {
    const transactions = await this.transactionRepo.findMany(where);
    return transactions;
  }
}
