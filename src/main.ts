
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation de CORS pour autoriser le frontend Angular
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      }
    ),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Club Web App')
    .setDescription("Documentation de l'API pour le backend du club")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrer le token JWT',
        in: 'header',
      },
      'JWT-auth', // Nom du security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Monte Swagger sur l'URL http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.PORT) || 3000);
}
await bootstrap();
