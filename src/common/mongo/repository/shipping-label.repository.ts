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
      const exMsg = `Ups! no pudimos generar el código de verificación, intente nuevamente.`;
      this.logger.verbose(exMsg);
      throw new InternalServerErrorException(exMsg);
    }
  }

  /*
  async findToken(findTokenValidateDTO: FindTokenValidateDTO): Promise<IToken> {
    const { _id } = findTokenValidateDTO;
    const token = await this.tokenModel.findOne(findTokenValidateDTO);
    if (!token) {
      const exMsg = `Ups! el proceso de verificación ${_id} no fué encontrado.`;
      this.logger.verbose(exMsg);
      throw new NotFoundException(exMsg);
    }
    return token;
  }

  async findProcess(
    findProcessValidateDTO: FindProcessValidateDTO,
  ): Promise<IToken> {
    const { authorizationKey } = findProcessValidateDTO;
    const token = await this.tokenModel.findOne(findProcessValidateDTO);

    if (!token) {
      const exMsg = `Ups! la autorización ${authorizationKey} no fué encontrado.`;
      this.logger.verbose(exMsg);
      throw new NotFoundException(exMsg);
    }

    const { _id: tokenId, expireAt } = token;
    if (expireAt < Math.floor(Date.now() / 1000)) {
      await this.deleteOne(tokenId);
      const exMsg = `Ups! la autorización ya expiró.`;
      this.logger.verbose(exMsg);
      throw new BadRequestException(exMsg);
    }

    return token;
  }

  async deleteOne(_id: string): Promise<void> {
    await this.tokenModel.deleteOne({ _id });
  }

  async findOneAndUpdate(
    where: FindTokenValidateDTO,
    columns: DataTokenDTO,
  ): Promise<void> {
    try {
      await this.tokenModel.findOneAndUpdate(where, columns);
    } catch (error) {
      const exMsg = `Ups! ocurrió un error al generar la authorizationKey.`;
      this.logger.verbose(exMsg);
      throw new InternalServerErrorException(exMsg);
    }
  }*/
}
