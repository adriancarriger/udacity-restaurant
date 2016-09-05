import { Route } from '@angular/router';
import { RestaurantComponent } from './restaurant.component';

export const RestaurantRoutes: Route[] = [
  {
    path: 'restaurant/:id',
    component: RestaurantComponent
  }
];