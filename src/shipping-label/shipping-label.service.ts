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
        let { shipments } = createShipmentsDTO;

        _.forEach(shipments, function(shipment) {
            shipment.status = "pending";      
        });

        const shipmentLabels:ShipmentLabelsDTO={
            userId: "622264ddcee521aa8e567269",
            authorizationId :  "622264ddcee521aa8e56726a",
            status:"pending",
            sendNotification :  "false",
            shipments,
        }

        await this.shippingLabelRepository.save(shipmentLabels);
        return createShipmentsDTO;
    }  
    
    
    @Cron('45 * * * * *')
    handleCron() {
        this.logger.debug('ShippingLabelService');
    }
}
