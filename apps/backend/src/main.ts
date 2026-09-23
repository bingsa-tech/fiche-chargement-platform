import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser le frontend Vue et Flutter Web à communiquer
  // avec l'API et à envoyer/recevoir les cookies HttpOnly.
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8085',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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

  SwaggerModule.setup(
    'api/docs',
    app,
    document,
  );

  await app.listen(8085, '0.0.0.0');

  console.log(
    'Serveur NestJS actif sur http://localhost:8085',
  );
}

bootstrap();

