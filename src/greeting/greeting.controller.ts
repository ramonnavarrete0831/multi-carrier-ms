import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GreetingService } from './greeting.service';

@Controller()
export class GreetingController {
    constructor(private greetingService:GreetingService){}
    @MessagePattern('hello')
    hello() : string {
       return this.greetingService.hello();
    }
}
