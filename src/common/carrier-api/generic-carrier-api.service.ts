import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiConfig } from './api-config.abstract';
import { IResultLabel } from './interfeces/result-label.interface';
import * as fs from "fs";
import * as https from "https";

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

  download( url:string , file_name : string)  {
    https.get(url, (res) => {
      const file = fs.createWriteStream(`files/pdf/${file_name}.pdf`);
      res.pipe(file);
      file.on('finish', () => {
          file.close();
      });
    }).on("error", (err) => {
      console.log("Error: ", err.message);
    });
  }
}
