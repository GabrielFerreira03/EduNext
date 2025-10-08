import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
  lastUpdated: string = '07 de outubro de 2024';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
