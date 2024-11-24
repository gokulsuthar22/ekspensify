import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import {
  AccountWhere,
  CreateAccountData,
  FilterAccountWhere,
  UpdateAccountData,
} from './account.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private accountRepo: AccountRepository) {}

  async credit(
    accountId: number,
    amount: number,
    ctx?: Prisma.TransactionClient,
  ) {
    const account = await this.accountRepo.credit(accountId, amount, ctx);
    return account;
  }

  async debit(
    accountId: number,
    amount: number,
    ctx?: Prisma.TransactionClient,
  ) {
    const account = await this.accountRepo.debit(accountId, amount, ctx);
    return account;
  }

  async createOne(data: CreateAccountData) {
    try {
      const account = await this.accountRepo.create(data);
      return account;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Account already exist', HttpStatus.CONFLICT);
      }
    }
  }

  async findOne(where: AccountWhere) {
    const account = await this.accountRepo.findOne(where);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    return account;
  }

  async updateOne(where: AccountWhere, data: UpdateAccountData) {
    const account = await this.accountRepo.findOneAndUpdate(where, data);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    return account;
  }

  async deleteOne(where: AccountWhere) {
    const account = await this.accountRepo.findOneAndDelete(where);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    return account;
  }

  async findMany(where?: FilterAccountWhere) {
    const accounts = await this.accountRepo.findMany(where);
    return accounts;
  }
}
