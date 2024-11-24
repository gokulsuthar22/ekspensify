import { PrismaService } from 'infra/persistence/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccountService } from '../account/account.service';

@Injectable()
export class TransactionRepository {
  constructor(
    private prismaService: PrismaService,
    private accountService: AccountService,
  ) {}

  private get Transaction() {
    return this.prismaService.transaction;
  }

  private select = {
    id: true,
    accountId: true,
    amount: true,
    note: true,
    type: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    account: {
      select: {
        name: true,
        icon: true,
      },
    },
    category: {
      select: {
        name: true,
        icon: true,
      },
    },
    attachment: {
      select: {
        small: true,
        medium: true,
        large: true,
      },
    },
  };

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    try {
      const tx = await this.prismaService.$transaction(async (ctx) => {
        const tx = await ctx.transaction.create({ data, select: this.select });
        const wallet = await this.accountService[data.type.toLowerCase()](
          data.accountId,
          data.amount,
          ctx,
        );
        if (wallet.balance < 0) {
          throw new HttpException(
            'Insufficient balance',
            HttpStatus.BAD_REQUEST,
          );
        }
        return tx;
      });
      return tx;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        e instanceof HttpException ? e.message : 'Failed to create transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: number) {
    const transaction = await this.Transaction.findUnique({
      where: { id },
      select: this.select,
    });
    return transaction;
  }

  async findByIdAndUpdate(
    id: number,
    data: Prisma.TransactionUncheckedCreateInput,
  ) {
    const transaction = await this.Transaction.update({
      where: { id },
      data,
      select: this.select,
    });
    return transaction;
  }

  async findByIdAndDelete(id: number) {
    const transaction = await this.prismaService.$transaction(async (ctx) => {
      const transaction = await ctx.transaction.delete({
        where: { id },
        select: this.select,
      });
      if (transaction) {
        await this.accountService.credit(
          transaction.accountId,
          +transaction.amount,
        );
      }
      return transaction;
    });
    return transaction;
  }

  async findOne(where: Prisma.TransactionWhereInput) {
    const transaction = await this.Transaction.findFirst({
      where,
      select: this.select,
    });
    return transaction;
  }

  async findOneAndUpdate(
    where: Prisma.TransactionWhereUniqueInput,
    data?: Prisma.TransactionUpdateInput,
  ) {
    const transaction = await this.Transaction.update({
      where,
      data,
      select: this.select,
    });
    return transaction;
  }

  async findOneAndDelete(where: Prisma.TransactionWhereUniqueInput) {
    const transaction = await this.prismaService.$transaction(async (ctx) => {
      const transaction = await ctx.transaction.delete({
        where,
        select: this.select,
      });
      if (transaction) {
        await this.accountService.credit(
          transaction.accountId,
          +transaction.amount,
          ctx,
        );
      }
      return transaction;
    });
    return transaction;
  }

  async findMany(where?: Prisma.TransactionWhereInput) {
    const transactions = await this.Transaction.findMany({
      where,
      select: this.select,
    });
    return transactions;
  }
}
