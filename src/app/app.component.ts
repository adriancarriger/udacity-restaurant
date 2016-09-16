import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { PlacesService } from './shared/index';
import { GlobalEventsService } from './shared/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {

  constructor(
    private places: PlacesService,
    private globalEventsService: GlobalEventsService) { }

  ngOnInit() {
    this.globalEventsService.init();
    this.places.loadPlaces();
  }
}
