import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingLabelRepository } from '../common/mongo/repository/shipping-label.repository';
import { SHIPPING_LABEL } from '../common/mongo/models';
import { ShippingLabelSchema } from '../common/mongo/schemas/shipping-label.schema';
import { ShippingLabelController } from './shipping-label.controller';
import { ShippingLabelService } from './shipping-label.service';
import { GenericCarrierApiService } from '../common/carrier-api/generic-carrier-api.service';
import { NotificationService } from '../common/notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: SHIPPING_LABEL.name,
        useFactory: () => {
          return ShippingLabelSchema;
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('SIGN_REQUEST_SECRET'),
      }),
    })
  ],
  controllers: [ShippingLabelController],
  providers: [ShippingLabelService, ShippingLabelRepository,GenericCarrierApiService,NotificationService],
})
export class ShippingLabelModule {}
