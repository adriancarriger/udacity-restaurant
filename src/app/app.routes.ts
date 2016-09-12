import { Routes } from '@angular/router';

import { homeRoutes } from './+home/index';
import { restaurantRoutes } from './+restaurant/index';
import { legalRoutes } from './+legal/index';

export const routes: Routes = [
  ...homeRoutes,
  ...restaurantRoutes,
  ...legalRoutes
];
