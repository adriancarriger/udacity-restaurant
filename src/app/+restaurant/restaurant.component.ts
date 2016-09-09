import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';

import { PlacesService } from '../shared/index';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  @ViewChild('reviewForm') reviewForm;
  public restaurantId: string;
  public showMore: boolean = false;
  public reviewSubmitted: boolean = false;
  public formInfo: any = {
    review: {
      title: '',
      instructions: 'Leave A Review',
      fields: [
        {
          name: 'Rating',
          type: 'rating',
          hideLabel: true,
          control: ['', Validators.required],
          maxRating: 5,
          defaultRating: 5
        },
        {
          name: 'Name',
          type: 'input',
          inputType: 'text',
          control: ['', Validators.required]
        },
        {
          name: 'Comments',
          type: 'textarea',
          control: ['', Validators.required]
        },
        {
          type: 'submit',
          text: 'Add Review'
        }
      ]
    }
  };
  constructor(public places: PlacesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.restaurantId = this.activatedRoute.snapshot.url[1].path;
    this.places.requestPlace( this.restaurantId );
  }

}
