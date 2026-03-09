import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();
let isInitialized = false;

const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: ['http://localhost:4200', 'https://ng-to-do.vercel.app'],
    credentials: true,
  });

  await app.init();
  return app;
};

export default async (req: express.Request, res: express.Response) => {
  if (!isInitialized) {
    await createNestServer(server);
    isInitialized = true;
  }
  server(req, res);
};
