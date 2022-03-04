import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GreetingModule } from './greeting/greeting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.develop'],
      isGlobal: true,
    }),
    GreetingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
