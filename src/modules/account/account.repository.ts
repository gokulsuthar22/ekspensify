import { PrismaService } from '@app/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountRepository {
  constructor(private prismaService: PrismaService) {}

  private get Account() {
    return this.prismaService.account;
  }

  private includes = {
    accountType: {
      select: {
        name: true,
        slug: true,
        category: true,
      },
    },
  };

  async create(data: Prisma.AccountUncheckedCreateInput) {
    return this.Account.create({ data, include: this.includes });
  }

  async findById(id: string) {
    return this.Account.findUnique({ where: { id }, include: this.includes });
  }

  async findByIdAndUpdate(
    id: string,
    data: Prisma.AccountUncheckedCreateInput,
  ) {
    try {
      return await this.Account.update({
        where: { id },
        data,
        include: this.includes,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.Account.delete({
        where: { id },
        include: this.includes,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.AccountWhereInput) {
    return this.Account.findFirst({ where, include: this.includes });
  }

  async findOneAndUpdate(
    where: Prisma.AccountWhereUniqueInput,
    data?: Prisma.AccountUpdateInput,
  ) {
    try {
      return await this.Account.update({
        where,
        data,
        include: this.includes,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOneAndDelete(where: Prisma.AccountWhereUniqueInput) {
    try {
      return await this.Account.delete({ where, include: this.includes });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findMany(where?: Prisma.AccountWhereInput) {
    return this.Account.findMany({ where, include: this.includes });
  }
}
