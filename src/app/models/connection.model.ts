import { HttpHeaders } from '@angular/common/http';

export interface Connection {
    apiKey: string;
    applicationId: string;
    options: Options;
    url: string;
}

interface Options {
    headers: HttpHeaders;
}

