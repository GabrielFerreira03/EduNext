import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.css']
})
export class TermsOfUseComponent {
  lastUpdated: string = '07 de outubro de 2024';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
