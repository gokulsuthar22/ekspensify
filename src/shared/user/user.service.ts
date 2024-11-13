import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import { PaginationParams } from 'src/common/types/pagination.type';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async findMany(where?: PaginationParams) {
    return this.userRepo.findMany(where);
  }

  async findById(id: string) {
    return this.userRepo.findById(id);
  }

  async updateById(id: string, data: Prisma.UserUpdateInput) {
    return this.userRepo.findByIdAndUpdate(id, data);
  }

  async deleteById(id: string) {
    return this.userRepo.findByIdAndDelete(id);
  }
}
