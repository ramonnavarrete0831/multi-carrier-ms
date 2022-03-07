import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusEnum } from '../../../shipping-label/enum/status.enum';
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
      throw new RpcException(exMsg);
    }
  }

  async findByUser(userId:string,authorizationId:string,  _id:string): Promise<IShippingLabel> {
    const filters = {
      _id,
      userId,
      authorizationId,
    };
    const shipmentLabel = await this.shippingLabelModel.findOne(filters);

    if (!shipmentLabel) {
      const exMsg = `Ups! no fué encontrada la información solicitada.`;
      this.logger.verbose(exMsg);
      throw new RpcException(exMsg);
    }
    return shipmentLabel;
  }

  async findPending(): Promise<IShippingLabel> {
    const filters = {
      $or: [
        {status : StatusEnum.PENDING},
        {status : StatusEnum.PROCESSING},
      ]
    };
    const update = { status : StatusEnum.PROCESSING };
    return await this.shippingLabelModel.findOneAndUpdate(filters,update);
  }

  async updateShipment( _id:string, update : any ): Promise<void> {
    const filters = {
      shipments: {
        $elemMatch: {
          _id,
        },
      },
    };
    await this.shippingLabelModel.findOneAndUpdate(filters,{$set:{'shipments.$':update}});
  }

  async markAsDone( _id : string): Promise<void> {
    const filters = { _id };
    const update = { status : StatusEnum.COMPLETED };
    await this.shippingLabelModel.findOneAndUpdate(filters,update);
  }

}
