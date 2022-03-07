interface IAttributes{
    shipment_id: number,
    tracking_number : string,
    file_url : string,
}

export interface IResultLabel{
    id : string,
    type : string,
    attributes : IAttributes,
}