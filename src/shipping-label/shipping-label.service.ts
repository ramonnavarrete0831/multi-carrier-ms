import { Injectable, Logger } from '@nestjs/common';
import { Interval} from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import * as _ from "lodash";
import { GenericCarrierApiService } from '../common/carrier-api/generic-carrier-api.service';
import { ShipmentLabelsDTO } from '../common/mongo/dto/shipment-labels.dto';
import { ShippingLabelRepository } from '../common/mongo/repository/shipping-label.repository';
import { CreateShipmentsDTO } from './dto/create-shipments.dto';
import { IdDTO } from './dto/id.dto';
import { StatusEnum } from './enum/status.enum';
import { IResponseCreateLabels } from './interfaces/response-create-labels.interfaces';
import { NotificationService } from '../common/notification/notification.service';
import { CarierEnum } from './enum/carrier.enum';
import { FakeCarrierApi } from '../common/carrier-api/fake-carrier-api';
import * as AdmZip from "adm-zip";
import * as fs from "fs";

 
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
        idDTO: IdDTO
    ): Promise<IResponseCreateLabels> {
        const { id, user } = idDTO;
        const { userId, authorizationId } = user;

        const { shipments, status} = await this.shippingLabelRepository.findByUser(userId, authorizationId, id);
        const size = _.size(shipments);

        let processed = status===StatusEnum.COMPLETED ?size :0 ;

        if(status!=StatusEnum.COMPLETED){
            _.forEach(shipments, function(shipment) {
                const { status } = shipment;
                if(status==StatusEnum.COMPLETED){
                    processed++;
                }
            });
        }
      
        const iResponseCreateLabels : IResponseCreateLabels = {
            id, 
            status, 
            processed, 
            size,
            text:`Proceso : ${processed} / ${size}`
        }
        return  iResponseCreateLabels;
    }  


    async getZipFile(
        idDTO: IdDTO
    ): Promise<string> {

        const { id, user } = idDTO;
        const { userId, authorizationId } = user;

        const { id:idProcess, shipments} = await this.shippingLabelRepository.findByUser(userId, authorizationId, id);
      
        const zip = new AdmZip();
        const outputFile = `./files/zip/${idProcess}.zip`;

        let processed = 0 ;

        _.forEach(shipments, function(shipment) {
            const { status, tracking_number } = shipment;
            if(status==StatusEnum.COMPLETED){
                processed++;
                zip.addLocalFile(`./files/pdf/${tracking_number}.pdf`);
            }
        });
      
        zip.writeZip(outputFile);

        let binary = null;
        try {
            binary  = fs.readFileSync(outputFile, 'utf8');
        } catch (err) {

        }

        return binary;
    }  
    
    
    //@Cron('45 * * * * *')
    @Interval(5000)
    async handleCron() : Promise<void> {

        const shipmentLabel = await this.shippingLabelRepository.findPending();
        if(shipmentLabel){
            
            const { _id : idProcess, authorizationId, shipments,  } = shipmentLabel;

            const size = _.size(shipments);
            let processed = 0;           
            
            for (let key = 0; key < shipments.length; key++) {
                const shipment = shipments[key];
                const { _id : idRequest, status, carrier } = shipment;
                if(status!=StatusEnum.COMPLETED){
                    
                    let apiConfig = null;
                    if(carrier == CarierEnum.FAKE_CARRIER){
                        apiConfig = new FakeCarrierApi();
                    }

                    const resultLabel = await this.genericCarrierApiService.createLabel(shipment, apiConfig);
                    
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

                        this.genericCarrierApiService.download(file_url, tracking_number);
                        await this.shippingLabelRepository.updateShipment(idRequest,update);
                     

                    }
                }else{
                    processed++;
                }
            }

            if(processed == size){
                await this.shippingLabelRepository.markAsDone(idProcess);
                const notification = {
                    authorizationId,
                    message : `\`\`\`¡Buenas noticias!\`\`\`\n\nEl proceso con Id ${idProcess} para solicitud de guias ha finalizado, puedes consultarlo en tu panel de administración.`,
                };
                const signedRequest = await this.jwtService.sign(notification);
                await this.notificationService.whatsapp(signedRequest);
            }
        }
    }
}
