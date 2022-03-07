import { Injectable, Logger } from '@nestjs/common';
import { Interval} from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import * as _ from "lodash";
import { GenericCarrierApiService } from '../common/carrier-api/generic-carrier-api.service';
import { ShipmentLabelsDTO } from '../common/mongo/dto/shipment-labels.dto';
import { ShippingLabelRepository } from '../common/mongo/repository/shipping-label.repository';
import { CreateShipmentsDTO } from './dto/create-shipments.dto';
import { IdDTO } from './dto/id.dto';
import { UserDTO } from './dto/user-dto';
import { StatusEnum } from './enum/status.enum';
import { IResponseCreateLabels } from './interfaces/response-create-labels.interfaces';
import { NotificationService } from '../common/notification/notification.service';

@Injectable()
export class ShippingLabelService {
    private logger = new Logger('ShippingLabelService');

    constructor(
        private readonly jwtService: JwtService,
        private readonly shippingLabelRepository: ShippingLabelRepository,
        private readonly genericCarrierApiService: GenericCarrierApiService,
        private readonly notificationService : NotificationService
    ) {}

    async create(
        createShipmentsDTO: CreateShipmentsDTO,
    ): Promise<IResponseCreateLabels> {

        const { user : { userId, authorizationId } } = createShipmentsDTO;
        let { shipments } = createShipmentsDTO;
        const size = _.size(shipments);
        const status = StatusEnum.PENDING;
        let processed = 0;

        _.forEach(shipments, function(shipment) {
            shipment.status = StatusEnum.PENDING;   
            shipment.tracking_number="";
            shipment.file_url="";
        });

        const shipmentLabels:ShipmentLabelsDTO={
            userId,
            authorizationId,
            status,
            sendNotification :  "false",
            shipments,
        }

        const { _id : id } = await this.shippingLabelRepository.save(shipmentLabels);
    
        const iResponseCreateLabels : IResponseCreateLabels = {
            id, 
            status, 
            processed, 
            size,
            text:`Proceso : ${processed} / ${size}`
        }

        return  iResponseCreateLabels;
    }  

    async getById(
        idDTO: IdDTO,
        userDTO: UserDTO
    ): Promise<IResponseCreateLabels> {
        const { id } = idDTO;
        const { userId, authorizationId } = userDTO;

        const { shipments, status} = await this.shippingLabelRepository.findByUser(userId, authorizationId, id);

        const size = _.size(shipments);
        let processed = 0;

        _.forEach(shipments, function(shipment) {
            const { status } = shipment;
            if(status==StatusEnum.COMPLETED){
                processed++;
            }
        });
      
        const iResponseCreateLabels : IResponseCreateLabels = {
            id, 
            status, 
            processed, 
            size,
            text:`Proceso : ${processed} / ${size}`
        }
        return  iResponseCreateLabels;
    }  
    
    
    //@Cron('45 * * * * *')
    @Interval(5000)
    async handleCron() : Promise<void> {
        const shipmentLabel = await this.shippingLabelRepository.findPending();
        if(shipmentLabel){
            const { _id : id, authorizationId } = shipmentLabel;
            const { shipments }  = shipmentLabel;
            const size = _.size(shipments);
            let processed = 0;

            const shippingLabelRepository =  this.shippingLabelRepository;
            const genericCarrierApiService =  this.genericCarrierApiService;

            for (let key = 0; key < shipments.length; key++) {
                const shipment = shipments[key];
                const { _id : idRequest, status } = shipment;
                if(status!=StatusEnum.COMPLETED){
                    const resultLabel = await genericCarrierApiService.createLabel(shipment);
                    if(resultLabel){
                        processed++;
                        const{ attributes } = resultLabel;
                        const { tracking_number, file_url} = attributes;

                        const update = {
                            status:StatusEnum.COMPLETED,
                            tracking_number,
                            file_url,
                            shipment : shipment.shipment
                        };
                        await shippingLabelRepository.updateShipment(idRequest,update);
                    }
                }else{
                    processed++;
                }
            }

            if(processed == size){
                
                await this.shippingLabelRepository.markAsDone(id);
                this.logger.log(`Proceso : ${processed} / ${size}`);

                const notification = {
                    authorizationId,
                    message : `\`\`\`¡Buenas noticias!\`\`\`\n\nEl proceso con Id ${id} para solicitud de guias ha finalizado, puedes consultarlo en tu panel de administración.`,
                };

                const signedRequest = await this.jwtService.sign(notification);
                await this.notificationService.whatsapp(signedRequest);
            }
        }

        return null;
    }
}
