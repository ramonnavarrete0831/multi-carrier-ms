import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingLabelRepository } from '../common/mongo/repository/shipping-label.repository';
import { SHIPPING_LABEL } from '../common/mongo/models';
import { ShippingLabelSchema } from '../common/mongo/schemas/shipping-label.schema';
import { ShippingLabelController } from './shipping-label.controller';
import { ShippingLabelService } from './shipping-label.service';
import { GenericCarrierApiService } from '../common/carrier-api/generic-carrier-api.service';

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
  ],
  controllers: [ShippingLabelController],
  providers: [ShippingLabelService, ShippingLabelRepository,GenericCarrierApiService],
})
export class ShippingLabelModule {}
