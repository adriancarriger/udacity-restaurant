import { Route } from '@angular/router';
import { RestaurantComponent } from './restaurant.component';

export const restaurantRoutes: Route[] = [
  {
    path: 'restaurant/:id',
    component: RestaurantComponent
  }
];
