import { Injectable } from '@nestjs/common';
import { CustomCategoryIcon } from '@prisma/client';
import { Repository } from 'common/types/repository.interface';
import {
  CreateCustomCategoryIconData,
  CustomCategoryIconWhere,
  FilterCustomCategoryIconWhere,
  UpdateCustomCategoryIconData,
} from './custom-category-icon.interface';
import { PrismaService } from 'infra/persistence/prisma/prisma.service';

@Injectable()
export class CustomCategoryIconRepository
  implements
    Repository<
      CustomCategoryIcon,
      CreateCustomCategoryIconData,
      UpdateCustomCategoryIconData,
      CustomCategoryIconWhere
    >
{
  constructor(private prismaService: PrismaService) {}

  private get CustomCategoryIcon() {
    return this.prismaService.customCategoryIcon;
  }

  private include = {
    icon: true,
  };

  async create(data: CreateCustomCategoryIconData) {
    const categoryIcon = await this.CustomCategoryIcon.create({
      data,
      include: this.include,
    });
    return categoryIcon;
  }

  async findById(id: number) {
    const categoryIcon = await this.CustomCategoryIcon.findUnique({
      where: { id },
      include: this.include,
    });
    return categoryIcon;
  }

  async findByIdAndUpdate(id: number, data: UpdateCustomCategoryIconData) {
    const categoryIcon = await this.CustomCategoryIcon.update({
      where: { id },
      data,
      include: this.include,
    });
    return categoryIcon;
  }

  async findByIdAndDelete(id: number) {
    const category = await this.CustomCategoryIcon.delete({
      where: { id },
      include: this.include,
    });
    return category;
  }

  async findOne(where: CustomCategoryIconWhere) {
    const category = await this.CustomCategoryIcon.findFirst({
      where,
      include: this.include,
    });
    return category;
  }

  async findOneAndUpdate(
    where: CustomCategoryIconWhere,
    data?: UpdateCustomCategoryIconData,
  ) {
    const category = await this.CustomCategoryIcon.update({
      where,
      data,
      include: this.include,
    });
    return category;
  }

  async findOneAndDelete(where: CustomCategoryIconWhere) {
    const category = await this.CustomCategoryIcon.delete({
      where,
      include: this.include,
    });
    return category;
  }

  async findMany(where?: FilterCustomCategoryIconWhere) {
    const categoryIcons = await this.CustomCategoryIcon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: this.include,
    });
    return categoryIcons;
  }
}
