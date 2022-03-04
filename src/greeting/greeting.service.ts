import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GreetingService {
  private readonly logger = new Logger(GreetingService.name);
  hello(): string {
    return 'MicroServicio';
  }

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
