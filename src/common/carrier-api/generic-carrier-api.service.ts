import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiConfig } from './api-config.abstract';
import { IResultLabel } from './interfeces/result-label.interface';

@Injectable()
export class GenericCarrierApiService {
  async createLabel(data:any, apiConfig: ApiConfig): Promise<IResultLabel> {
    
    let result = null;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token token=${apiConfig.getAuthorization()}`
      }
    }
    
    try {
      await axios
        .post(
          apiConfig.getEndPoint(),
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
