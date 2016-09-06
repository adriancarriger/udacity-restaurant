import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FromUnixPipe, DateFormatPipe } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { RestaurantComponent } from './restaurant.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    RestaurantComponent,
    FromUnixPipe,
    DateFormatPipe
  ],
  exports: [RestaurantComponent],
  providers: []
})

export class RestaurantModule {  }
