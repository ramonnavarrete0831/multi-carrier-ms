import { Document } from 'mongoose';
import { ShipmentLabelsDTO } from '../dto/shipment-labels.dto';

export interface IShippingLabel extends ShipmentLabelsDTO, Document {}
