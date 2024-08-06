import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Apei api')
    .setDescription('The API for apei')
    .setVersion('1.0')
    .addTag('apei')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apei-api', app, document);
  await app.listen(3000);

}
bootstrap();
