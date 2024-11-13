import { Injectable } from '@nestjs/common';
import { AccountTypeRepository } from './account-type.repository';
import {
  CreateAccountTypeData,
  FilterAccountTypeWhere,
  UpdateAccountTypeData,
} from './account-type.interface';

@Injectable()
export class AccountTypeService {
  constructor(private accountTypeRepo: AccountTypeRepository) {}

  async create(data: CreateAccountTypeData) {
    return this.accountTypeRepo.create(data);
  }

  async updateById(id: string, data: UpdateAccountTypeData) {
    return this.accountTypeRepo.findByIdAndUpdate(id, data);
  }

  async deleteById(id: string) {
    return this.accountTypeRepo.findByIdAndDelete(id);
  }

  async findMany(where?: FilterAccountTypeWhere) {
    return this.accountTypeRepo.findMany(where);
  }
}
