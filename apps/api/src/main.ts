import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RawBodyRequest, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
  type OpenAPIObject,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, Request, urlencoded } from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    json({
      verify: (req: RawBodyRequest<Request>, res, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      verify: (req: RawBodyRequest<Request>, res, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
  const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(',') ?? [];
  if (!allowedOrigins?.length) throw new Error('FRONTEND_ORIGIN is not set');
  console.debug(`Allowed origins: ${allowedOrigins.join(', ')}`);
  app.enableCors({
    origin: (origin, callback) => {
      console.log(`Origin: ${origin}`);
      return callback(null, true);
      // if (!origin) return callback(null, true);
      // if (allowedOrigins.includes(origin)) return callback(null, true);
      // return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('My Ledger API')
    .setDescription('API docs for ledger')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
