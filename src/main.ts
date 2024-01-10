import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser'
import * as path from 'path'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  SwaggerConfigInit(app);
  app.useStaticAssets(path.join(process.cwd(), "public"));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      skipMissingProperties: false
    })
  );
  await app.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));
}
bootstrap();
