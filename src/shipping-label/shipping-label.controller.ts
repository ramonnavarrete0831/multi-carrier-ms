import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateShipmentsDTO } from './dto/create-shipments.dto';
import { IResponseCreateLabels } from './interfaces/response-create-labels.interfaces';
import { ShippingLabelService } from './shipping-label.service';

@Controller('shipping-label')
export class ShippingLabelController {
    private logger = new Logger('ShippingLabelController');
    constructor(private shippingLabelService: ShippingLabelService) {}

    @Post("create")
    async create(
        @Body() createShipmentsDTO: CreateShipmentsDTO,
    ): Promise<IResponseCreateLabels> {
        this.logger.verbose(
            `Petición para la creación de guias de envío`,
        );
        return this.shippingLabelService.create(createShipmentsDTO);
    }
}
