import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Services
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const prismaService: PrismaService = app.get<PrismaService>(PrismaService);

  // Setup schema validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Setup swagger
  const config = new DocumentBuilder()
    .setTitle('RTech API')
    .setDescription('The api for RTech Diagnostics')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Fix enableShutDownHook issue with prisma
  await prismaService.enableShutdownHooks(app);

  const PORT = configService.get<number>('PORT') || 8000;
  await app.listen(PORT, () => logger.log(`Server listening on port ${PORT}`));
}
bootstrap();
