import { UserDTO } from "./user-dto";

class AddressFromDTO {
  name: string;
  street1: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
}

class AddressToDTO {
  name: string;
  street1: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
}

class ParcelDTO {
  length: number;
  width: number;
  height: number;
  dimensions_unit: string;
  weight: number;
  weight_unit: string;
}

class ShipmentDTO {
  address_from: AddressFromDTO;
  address_to: AddressToDTO;
  parcels: ParcelDTO[];
}



class RootShipmentDTO {
  status ? : string ;
  tracking_number ? : string;
  file_url ? : string;
  carrier: string;
  shipment: ShipmentDTO;
}

export class CreateShipmentsDTO {
  user: UserDTO;
  shipments: RootShipmentDTO[];
}
