import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShipmentLabelsDTO } from '../dto/shipment-labels.dto';
import { IShippingLabel } from '../interfaces/shipping-label.interface';
import { SHIPPING_LABEL } from '../models';

@Injectable()
export class ShippingLabelRepository {
  private logger = new Logger('ShippingLabelRepository');

  constructor(
    @InjectModel(SHIPPING_LABEL.name) private readonly shippingLabelModel: Model<IShippingLabel>,
  ) {}

  async save(shipmentLabelsDTO: ShipmentLabelsDTO): Promise<IShippingLabel> {
    const newshipmentLabels = new this.shippingLabelModel(shipmentLabelsDTO);
    try {
      return await newshipmentLabels.save();
    } catch (error) {
      console.log(error);
      const exMsg = `Ups! no pudimos almacenar la información de envío, intente nuevamente.`;
      this.logger.verbose(exMsg);
      throw new InternalServerErrorException(exMsg);
    }
  }

  async findPending(): Promise<IShippingLabel[]> {
    const pendingLabels = await this.shippingLabelModel.find({});
    return pendingLabels;
  }

}
