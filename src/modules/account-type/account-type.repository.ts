import { PrismaService } from '@app/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountTypeRepository {
  constructor(private prismaService: PrismaService) {}

  private get AccountType() {
    return this.prismaService.accountType;
  }

  async create(data: Prisma.AccountTypeUncheckedCreateInput) {
    return this.AccountType.create({ data });
  }

  async findById(id: string) {
    return this.AccountType.findUnique({ where: { id } });
  }

  async findByIdAndUpdate(id: string, data: Prisma.AccountTypeUpdateInput) {
    try {
      return await this.AccountType.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.AccountType.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.AccountTypeWhereInput) {
    return this.AccountType.findFirst({ where });
  }

  async findOneAndUpdate(
    where: Prisma.AccountTypeWhereUniqueInput,
    data?: Prisma.AccountTypeUpdateInput,
  ) {
    try {
      return await this.AccountType.update({
        where,
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOneAndDelete(where: Prisma.AccountTypeWhereUniqueInput) {
    try {
      return await this.AccountType.delete({ where });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findMany(where?: Prisma.AccountTypeWhereInput) {
    return this.AccountType.findMany({ where });
  }
}
