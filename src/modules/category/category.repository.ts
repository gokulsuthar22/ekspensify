import { PrismaService } from '@app/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  private get Category() {
    return this.prismaService.category;
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    return this.Category.create({ data });
  }

  async findById(id: string) {
    return this.Category.findUnique({ where: { id } });
  }

  async findByIdAndUpdate(
    id: string,
    data: Prisma.CategoryUncheckedCreateInput,
  ) {
    try {
      return await this.Category.update({
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
      return await this.Category.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOne(where: Prisma.CategoryWhereInput) {
    return this.Category.findFirst({ where });
  }

  async findOneAndUpdate(
    where: Prisma.CategoryWhereUniqueInput,
    data?: Prisma.CategoryUpdateInput,
  ) {
    try {
      return await this.Category.update({
        where,
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findOneAndDelete(where: Prisma.CategoryWhereUniqueInput) {
    try {
      return await this.Category.delete({ where });
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  async findMany(where?: Prisma.CategoryWhereInput) {
    return this.Category.findMany({ where });
  }
}
