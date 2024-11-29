import * as morgan from 'morgan';
import * as compression from 'compression';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './core/exceptions/http.exception';
// import { ValidationPipe } from 'core/pipes/extended-validation.pipe';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.use(compression());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true,
      stopAtFirstError: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
    }),
  );

  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
};

bootstrap();
