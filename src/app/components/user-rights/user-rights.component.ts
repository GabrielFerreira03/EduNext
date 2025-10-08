import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.css']
})
export class UserRightsComponent {
  lastUpdated = '15 de dezembro de 2024';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
