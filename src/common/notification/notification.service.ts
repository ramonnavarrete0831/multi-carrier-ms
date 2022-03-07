import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {
  private baseEndPoint = `${process.env.WHATSAPP_HOST}:${process.env.WHATSAPP_PORT}`;

  async whatsapp(signedRequest:string): Promise<void> {
    const data = {
      signedRequest
    }
    try {
      await axios
        .post(
          `${this.baseEndPoint}/notification/whatsapp`,
          data,
        )
        .then((res) => {
        });
    } catch (error) {}
  }
}
