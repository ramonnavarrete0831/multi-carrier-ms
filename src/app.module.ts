import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GreetingModule } from './greeting/greeting.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
