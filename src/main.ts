import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ 
      trustProxy: true,
      logger: true
    }),
  );
  
  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET, POST, PUT, DELETE',
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3000;
  const host = '0.0.0.0';
  
  await app.listen(port, host);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
