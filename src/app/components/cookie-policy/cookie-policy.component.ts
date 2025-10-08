import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.css']
})
export class CookiePolicyComponent {
  lastUpdated: string = '07 de outubro de 2024';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
