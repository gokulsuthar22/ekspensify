import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import {
  AccountWhere,
  CreateAccountData,
  FilterAccountWhere,
  UpdateAccountData,
} from './account.interface';

@Injectable()
export class AccountService {
  constructor(private accountRepo: AccountRepository) {}

  async createOne(data: CreateAccountData) {
    return this.accountRepo.create(data);
  }

  async findOne(where: AccountWhere) {
    return this.accountRepo.findOne(where);
  }

  async updateOne(where: AccountWhere, data: UpdateAccountData) {
    return this.accountRepo.findOneAndUpdate(where, data);
  }

  async deleteOne(where: AccountWhere) {
    return this.accountRepo.findOneAndDelete(where);
  }

  async findMany(where?: FilterAccountWhere) {
    return this.accountRepo.findMany(where);
  }
}
