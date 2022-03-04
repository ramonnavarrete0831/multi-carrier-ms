import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

// Create a logger instance
const logger = new Logger('Main');
const host = process.env.HOST;
const port = process.env.PORT;

// Create the microservice options object
const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host,
    port,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  app.listen();

  /*const app = await NestFactory.create(AppModule);
  app.listen(8877);*/

  logger.log(`Microservice Listening on ${host}:${port}`);
}
bootstrap();
