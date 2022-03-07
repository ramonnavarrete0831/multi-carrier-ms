import { ApiConfig } from "./api-config.abstract";

export class FakeCarrierApi extends ApiConfig {
    getServiceName() { 
        return "fake_carrier";
    }

    getEndPoint() { 
        return "https://fake-carrier-api.skydropx.com/v1/labels";
    }

    getAuthorization() { 
        return "vgEOaYn0LItk5K9FBEP9j9EUjZwcZvvL";
    }
}