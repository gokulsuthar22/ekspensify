import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import { PaginationParams } from 'common/types/pagination.type';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async findMany(where?: PaginationParams) {
    return this.userRepo.findMany(where);
  }

  async findById(id: number) {
    return this.userRepo.findById(id);
  }

  async updateById(id: number, data: Prisma.UserUpdateInput) {
    return this.userRepo.findByIdAndUpdate(id, data);
  }

  async deleteById(id: number) {
    return this.userRepo.findByIdAndDelete(id);
  }
}
