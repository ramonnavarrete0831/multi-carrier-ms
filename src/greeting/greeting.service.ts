import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GreetingService {
  private readonly logger = new Logger(GreetingService.name);
  hello(): string {
    return 'MicroServicio';
  }
}
