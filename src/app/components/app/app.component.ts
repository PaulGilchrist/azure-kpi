import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdalService } from 'adal-angular4';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private adalService: AdalService, public router: Router) {
        // init requires object with clientId and tenant properties
        adalService.init(environment.azureAuthProvider);
    }

    ngOnInit(): void {
    }

}
