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
import { AccountTypeModule } from './modules/account-type/account-type.module';
import { AccountModule } from './modules/account/account.module';

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
    MeModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AccountTypeModule,
    AccountModule,
  ],
})
export class AppModule {}
