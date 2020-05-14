import { Component } from '@angular/core';

import { AdalService } from 'adal-angular4';

@Component({
  selector: 'app-token',
  styleUrls: ['./token.component.scss'],
  templateUrl: './token.component.html'
})
export class TokenComponent {
  constructor(
    public adalService: AdalService,
  ) {}

  getDateString(num: number): string {
    let returnString = '';
    if (num) {
      returnString = num + ' (' + new Date(num * 1000) + ')';
    }
    return returnString;
  }

  logout(): void {
    this.adalService.logOut();
  }
}
