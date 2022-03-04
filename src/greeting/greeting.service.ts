import { Injectable } from '@nestjs/common';

@Injectable()
export class GreetingService {

    hello():string{
        return "Hello World!";
    }

}
