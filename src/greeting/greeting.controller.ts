import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CarrierSMG } from 'src/common/constant';
import { GreetingService } from './greeting.service';

@Controller()
export class GreetingController {
    constructor(private greetingService:GreetingService){}
    @MessagePattern({cmd: CarrierSMG.HELLO})
    hello() : string {
       return this.greetingService.hello();
    }
}
