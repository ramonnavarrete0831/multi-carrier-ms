import * as mongoose from 'mongoose';

const AddressFromSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street1: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postal_code: { type: String, required: true },
  country_code: { type: String, required: true },
});

const AddressToSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  street1:  { type: String, required: true },
  city:  { type: String, required: true },
  province:  { type: String, required: true },
  postal_code:  { type: String, required: true },
  country_code:  { type: String, required: true },
});

const ParcelSchema = new mongoose.Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  dimensions_unit: { type: String, required: true },
  weight: { type: Number, required: true },
  weight_unit: { type: String, required: true },
});

const ShipmentSchema = new mongoose.Schema({
  address_from: AddressFromSchema,
  address_to: AddressToSchema,
  parcels: [ParcelSchema],
});

const RootShipmentSchema = new mongoose.Schema({
  status: { type: String, required: true },
  tracking_number: { type: String, required: false },
  file_url: { type: String, required: false },
  carrier: { type: String, required: true },
  shipment: ShipmentSchema,
});

export const ShippingLabelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  authorizationId : { type: String, required: true },
  status : { type: String, required: true },
  sendNotification : { type: String, required: true },
  shipments : [RootShipmentSchema],
},{ timestamps: true });
