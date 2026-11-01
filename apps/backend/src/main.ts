
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // =====================================================
  // 1. PRÉFIXE GLOBAL API
  // =====================================================
  app.setGlobalPrefix('api');

  // =====================================================
  // 2. MIDDLEWARE COOKIES
  // =====================================================
  app.use(cookieParser());

  // =====================================================
  // 3. CONFIGURATION CORS
  // =====================================================
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://fiche-chargement-platform-frontend.onrender.com',
    ],
    credentials: true,
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  // =====================================================
  // 4. VALIDATION GLOBALE DES DTO
  // =====================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // =====================================================
  // 5. CONFIGURATION SWAGGER
  // =====================================================
  const config = new DocumentBuilder()
    .setTitle('API Fiche de Chargement')
    .setDescription(
      'API de gestion des fiches de chargement, chauffeurs, véhicules, documents et alertes',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup('api/docs', app, document);

  // =====================================================
  // 6. DÉMARRAGE DU SERVEUR
  // =====================================================
  const port = Number(process.env.PORT) || 8085;

  await app.listen(port, '0.0.0.0');

  console.log(
    `Serveur NestJS actif sur http://localhost:${port}`,
  );

  console.log(
    `Documentation Swagger : http://localhost:${port}/api/docs`,
  );
}

bootstrap();
