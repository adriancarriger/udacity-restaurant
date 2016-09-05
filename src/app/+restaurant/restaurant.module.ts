import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RestaurantComponent } from './restaurant.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    RestaurantComponent
  ],
  exports: [RestaurantComponent],
  providers: []
})

export class RestaurantModule { }
