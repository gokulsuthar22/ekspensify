import { PrismaService } from 'infra/persistence/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginationService } from 'common/services/pagination.service';
import { PaginationParams } from 'common/types/pagination.type';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private get User() {
    return this.prismaService.user;
  }

  async create(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    try {
      return await this.User.create({ data, include });
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

  async findById(id: number, include?: Prisma.UserInclude) {
    return this.User.findUnique({ where: { id }, include });
  }

  async findByIdAndUpdate(
    id: number,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude,
  ) {
    try {
      return await this.User.update({ where: { id }, data, include });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findByIdAndDelete(id: number, include?: Prisma.UserInclude) {
    try {
      return await this.User.delete({ where: { id }, include });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    return this.User.findFirst({ where, include });
  }

  async findOneAndUpdate(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude,
  ) {
    try {
      return await this.User.update({ where, data, include });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOneAndDelete(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
  ) {
    try {
      return await this.User.delete({ where, include });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findMany(where?: PaginationParams) {
    return this.paginationService.paginate<User>(this.User, where);
  }
}
