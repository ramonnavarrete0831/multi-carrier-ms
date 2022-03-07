import { Body, Controller, Logger, Post , Get, Param} from '@nestjs/common';
import { CreateShipmentsDTO } from './dto/create-shipments.dto';
import { IdDTO } from './dto/id.dto';
import { UserDTO } from './dto/user-dto';
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
            `Petición para la peción de procesamiento mediante el webservice.`,
        );
        return this.shippingLabelService.create(createShipmentsDTO);
    }

    @Get("/:id")
    async getById(
        @Param() idDTO: IdDTO,
        @Body() userDTO: UserDTO,
    ): Promise<IResponseCreateLabels> {
        this.logger.verbose(
            `Petición para obtener avances de proceamiento en el webservice`,
        );
        return this.shippingLabelService.getById(idDTO,userDTO);
    }
}
