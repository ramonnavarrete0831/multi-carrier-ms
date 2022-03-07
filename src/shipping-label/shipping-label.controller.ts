import { Body, Controller, Logger, Get, Param} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CarrierSMG } from 'src/common/constant';
import { CreateShipmentsDTO } from './dto/create-shipments.dto';
import { IdDTO } from './dto/id.dto';
import { UserDTO } from './dto/user-dto';
import { IResponseCreateLabels } from './interfaces/response-create-labels.interfaces';
import { ShippingLabelService } from './shipping-label.service';

@Controller()
export class ShippingLabelController {
    private logger = new Logger('ShippingLabelController');
    constructor(private shippingLabelService: ShippingLabelService) {}

    @MessagePattern({ cmd: CarrierSMG.SHIPPING_LABEL_CREATE })
    async create(
        @Body() createShipmentsDTO: CreateShipmentsDTO,
    ): Promise<IResponseCreateLabels> {
        this.logger.verbose(
            `Petición para la peción de procesamiento mediante el webservice.`,
        );
        return this.shippingLabelService.create(createShipmentsDTO);
    }

    
    @MessagePattern({ cmd: CarrierSMG.SHIPPING_LABEL_FIND })
    async getById(
        @Body() idDTO: IdDTO,
    ): Promise<IResponseCreateLabels> {
        this.logger.verbose(
            `Petición para obtener avances de proceamiento en el webservice`,
        );
        return this.shippingLabelService.getById(idDTO);
    }
}
