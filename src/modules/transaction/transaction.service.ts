import { HttpStatus, Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import {
  CreateTransactionData,
  FilterTransactionWhere,
  TransactionWhere,
  UpdateTransactionData,
  UploadAttachmentData,
} from './transaction.interface';
import { MediaRepository } from '@/helper/media/media.repository';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import { AwsS3Service } from '@/helper/media/services/aws-s3.service';
import { PaginationParams } from '@/common/types/pagination.type';

@Injectable()
export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
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
    const Transaction = await this.transactionRepo.findOneAndDelete(where);
    if (!Transaction) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Transaction not found');
    }
    return Transaction;
  }

  async findMany(where?: FilterTransactionWhere) {
    console.log(where);
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
