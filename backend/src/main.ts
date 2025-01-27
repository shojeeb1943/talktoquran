import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { AppModule } from './app.module';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://talktoquran.com',
      'http://talktoquran.com',
    ],
    credentials: true,
  });
  app.use(cookieParser());

  app.use(
    session({
      secret: 'we_love_Allah',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true, // true for HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // e.g., 1 day
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
