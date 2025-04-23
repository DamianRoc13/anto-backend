import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  
  const config = new DocumentBuilder()
    .setTitle('API ANTO')
    .setDescription('Documentación de la API ANTO')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingrese el token JWT',
      in: 'header',
    })
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API ANTO - Documentación',
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      docExpansion: 'none',
    },
  });

  await app.listen(3000);
  console.log(`Servidor corriendo en http://localhost:3000`);
  console.log(`Swagger UI disponible en http://localhost:3000/api`);
}
bootstrap();