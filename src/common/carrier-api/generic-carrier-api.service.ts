import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IResultLabel } from './interfeces/result-label.interface';

@Injectable()
export class GenericCarrierApiService {
  private baseEndPoint = 'https://fake-carrier-api.skydropx.com/v1';

  async createLabel(data:any): Promise<IResultLabel> {
    let result = null;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token=vgEOaYn0LItk5K9FBEP9j9EUjZwcZvvL'
      }
    }
    try {
      await axios
        .post(
          `${this.baseEndPoint}/labels`,
          data,
          options
        )
        .then((res) => {
          result = res.data.data;
        });
    } catch (error) {}
    return result;
  }
}
