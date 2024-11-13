import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { utc } from 'moment';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    this.$use(async (params, next) => {
      if (params.model === 'Category' && params.action.startsWith('find')) {
        if (!params.args.where) {
          params.args.where = {};
        }
        if (!params.args.where.deletedAt) {
          params.args.where.deletedAt = null;
        }
      }

      if (
        params.model === 'Category' &&
        (params.action.startsWith('update') ||
          params.action.startsWith('create'))
      ) {
        if (params.args.data.name) {
          params.args.data.slug = params.args.data.name
            .toLowerCase()
            .replace(/ /g, '-');
        }
      }

      if (
        params.model === 'AccountType' &&
        (params.action.startsWith('update') ||
          params.action.startsWith('create'))
      ) {
        if (params.args.data.name || params.args.data.category) {
          params.args.data.slug =
            params.args.data.name?.toLowerCase()?.replace(/ /g, '-') +
            '-' +
            params.args.data.category?.toLowerCase();
        }
      }

      if (
        (params.model === 'Category' ||
          params.model === 'Account' ||
          params.model === 'AccountType') &&
        params.action === 'delete'
      ) {
        params.action = 'update';
        params.args['data'] = { deletedAt: utc().toDate() };
      }

      return next(params);
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
