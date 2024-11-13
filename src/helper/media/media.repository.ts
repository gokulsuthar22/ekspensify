import { PrismaService } from '@app/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class MediaRepository {
  constructor(private prismaService: PrismaService) {}

  private get Media() {
    return this.prismaService.media;
  }

  async create(data: Prisma.MediaCreateInput) {
    return this.Media.create({ data });
  }

  async findById(id: string) {
    return this.Media.findUnique({ where: { id } });
  }

  async findByIdAndUpdate(id: string, data: Prisma.MediaUpdateInput) {
    return this.Media.update({ where: { id }, data });
  }

  async findByIdAndDelete(id: string) {
    return this.Media.delete({ where: { id } });
  }

  async findOne(where: Prisma.MediaWhereInput) {
    return this.Media.findFirst({ where });
  }

  async findOneAndUpdate(
    where: Prisma.MediaWhereUniqueInput,
    data: Prisma.MediaUpdateInput,
  ) {
    return this.Media.update({ where, data });
  }

  async findOneAndDelete(where: Prisma.MediaWhereUniqueInput) {
    return this.Media.delete({ where });
  }

  async findMany(where?: Prisma.MediaWhereInput) {
    return this.Media.findMany({ where });
  }
}
