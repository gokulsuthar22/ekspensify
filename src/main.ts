import * as morgan from 'morgan';
import * as compression from 'compression';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './core/exceptions/http.exception';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.use(compression());

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
      enableDebugMessages: true,
      exceptionFactory(errors) {
        return {
          code: 400,
          message: 'Validation Failed',
          details: errors.map((error) => {
            return {
              field: error.property,
              message: Object.values(error.constraints),
            };
          }),
        };
      },
    }),
  );
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
};

bootstrap();
