import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UserModule } from './shared/user/user.module';
import { PersistenceModule } from './infra/persistence/persistence.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './modules/category/category.module';
import { MeModule } from './modules/me/me.module';
import { AccountModule } from './modules/account/account.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt').secret,
        signOptions: {
          expiresIn: configService.get('jwt').expiresIn,
        },
      }),
    }),
    PersistenceModule.register({
      type: 'prisma',
      global: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: await redisStore({
            socket: {
              host: 'localhost',
              port: 6379,
            },
          }),
        };
      },
    }),
    MeModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AccountModule,
    TransactionModule,
  ],
})
export class AppModule {}
