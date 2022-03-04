import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GreetingModule } from './greeting/greeting.module';
import { ShippingLabelModule } from './shipping-label/shipping-label.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['./.env.develop'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.URI_MONGODB),
    GreetingModule,
    ShippingLabelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
