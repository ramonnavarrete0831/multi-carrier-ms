import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as _ from "lodash";
import { ShipmentLabelsDTO } from '../common/mongo/dto/shipment-labels.dto';
import { ShippingLabelRepository } from '../common/mongo/repository/shipping-label.repository';
import { CreateShipmentsDTO } from './dto/create-shipments.dto';

@Injectable()
export class ShippingLabelService {
    private logger = new Logger('ShippingLabelService');

    constructor(
        private readonly shippingLabelRepository: ShippingLabelRepository
    ) {}

    async create(
        createShipmentsDTO: CreateShipmentsDTO,
    ): Promise<any> {
        const { user : { userId, authorizationId } } = createShipmentsDTO;
        let { shipments } = createShipmentsDTO;
        const size = _.size(shipments);
        let status = "pending"
        let processed = 0;

        _.forEach(shipments, function(shipment) {
            shipment.status = "pending";   
            shipment.tracking_number="";
            shipment.file_url="";
        });

        const shipmentLabels:ShipmentLabelsDTO={
            userId,
            authorizationId,
            status:"pending",
            sendNotification :  "false",
            shipments,
        }

        const { _id } = await this.shippingLabelRepository.save(shipmentLabels);
        return { _id, status, processed, size, text:`Proceso : ${processed} / ${size}`};
    }  
    
    
    @Cron('45 * * * * *')
    async handleCron() {
        //const pendingLabels = await this.shippingLabelRepository.findPending();
        //this.logger.debug(`${JSON.stringify(pendingLabels)}`);
        this.logger.debug(`handleCron`);
    }
}
