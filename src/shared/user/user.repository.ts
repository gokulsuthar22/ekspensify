import { PrismaService } from '@app/infra/persistence/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationParams } from 'src/common/types/pagination.type';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private get User() {
    return this.prismaService.user;
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.User.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'This email is already associated with an account. Please sign in instead.',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async findById(id: string) {
    return this.User.findUnique({ where: { id } });
  }

  async findByIdAndUpdate(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await this.User.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.User.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.UserWhereInput) {
    return this.User.findFirst({ where });
  }

  async findOneAndUpdate(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    try {
      return await this.User.update({ where, data });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOneAndDelete(where: Prisma.UserWhereUniqueInput) {
    try {
      return await this.User.delete({ where });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findMany(where?: PaginationParams) {
    return this.paginationService.paginate<User>(this.User, where);
  }
}
