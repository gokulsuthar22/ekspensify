import { PrismaService } from 'infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UtilService } from 'common/services/util.service';
import {
  CategoryWhere,
  CreateCategoryData,
  FilterCategoryWhere,
  GenerateCategorySlug,
  UpdateCategoryData,
} from './category.interface';
import { Repository } from 'common/types/repository.interface';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryRepository
  implements
    Repository<Category, CreateCategoryData, UpdateCategoryData, CategoryWhere>
{
  constructor(
    private prismaService: PrismaService,
    private utilService: UtilService,
  ) {}

  private get Category() {
    return this.prismaService.category;
  }

  private generateSlug(category: GenerateCategorySlug) {
    return this.utilService.slugifyText(
      category.name,
      category?.type,
      category?.userId?.toString(),
    );
  }

  private async updateSlug(id: number, slug: string) {
    const category = await this.Category.update({
      where: { id },
      data: { slug },
    });
    return category;
  }

  private generateIcon(name: string) {
    return 'ic_' + this.utilService.slugifyText(name).replace(/-/g, '_');
  }

  async create(data: CreateCategoryData) {
    const slug = this.generateSlug(data);
    if (!data.icon) {
      data.icon = this.generateIcon(data.name);
    }
    const category = await this.Category.create({
      data: { ...data, slug },
    });
    return category;
  }

  async findById(id: number) {
    const category = await this.Category.findUnique({ where: { id } });
    return category;
  }

  async findByIdAndUpdate(id: number, data: UpdateCategoryData) {
    if (data.name) {
      data.icon = this.generateIcon(data.name);
    }
    let category = await this.Category.update({
      where: { id },
      data,
    });
    if (data.name || data.type) {
      const slug = this.generateSlug(category);
      category = await this.updateSlug(category.id, slug);
    }
    return category;
  }

  async findByIdAndDelete(id: number) {
    const category = await this.Category.delete({
      where: { id },
    });
    return category;
  }

  async findOne(where: CategoryWhere) {
    const category = await this.Category.findFirst({ where });
    return category;
  }

  async findOneAndUpdate(where: CategoryWhere, data?: UpdateCategoryData) {
    if (data.name) {
      data.icon = this.generateIcon(data.name);
    }
    let category = await this.Category.update({
      where,
      data,
    });
    if (data.name || data.type) {
      const slug = this.generateSlug(category);
      category = await this.updateSlug(category.id, slug);
    }
    return category;
  }

  async findOneAndDelete(where: CategoryWhere) {
    const category = await this.Category.delete({ where });
    return category;
  }

  async findMany(where?: FilterCategoryWhere) {
    const categories = await this.Category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return categories;
  }
}
