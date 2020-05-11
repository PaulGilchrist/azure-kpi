import { HttpHeaders } from '@angular/common/http';

export interface Connection {
    apiKey: string;
    applicationId: string;
    options: Options;
    roleName: string,
    url: string;
}

interface Options {
    headers: HttpHeaders;
}

