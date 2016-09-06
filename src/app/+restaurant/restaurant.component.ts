import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PlacesService } from '../shared/index';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  public restaurantId: string;
  constructor(public places: PlacesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.restaurantId = this.activatedRoute.snapshot.url[1].path;
    this.places.requestPlace( this.restaurantId );
  }

}
