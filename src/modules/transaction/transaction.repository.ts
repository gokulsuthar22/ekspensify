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

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    try {
      const tx = await this.prismaService.$transaction(async (ctx) => {
        const tx = await ctx.transaction.create({ data });
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
    return this.Transaction.findUnique({ where: { id } });
  }

  async findByIdAndUpdate(
    id: number,
    data: Prisma.TransactionUncheckedCreateInput,
  ) {
    try {
      return await this.Transaction.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      return await this.Transaction.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.TransactionWhereInput) {
    return this.Transaction.findFirst({ where });
  }

  async findOneAndUpdate(
    where: Prisma.TransactionWhereUniqueInput,
    data?: Prisma.TransactionUpdateInput,
  ) {
    try {
      return await this.Transaction.update({
        where,
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOneAndDelete(where: Prisma.TransactionWhereUniqueInput) {
    try {
      return await this.Transaction.delete({ where });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findMany(where?: Prisma.TransactionWhereInput) {
    return this.Transaction.findMany({
      where,
      select: {
        id: true,
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
      },
    });
    // return this.paginationService.paginate<Transaction>(
    //   this.Transaction,
    //   where,
    // );
  }
}
