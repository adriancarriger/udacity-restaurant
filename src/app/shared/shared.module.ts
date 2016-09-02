import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideLazyMapsAPILoaderConfig, GOOGLE_MAPS_PROVIDERS } from 'angular2-google-maps/core';

import { NavbarComponent } from './navbar/index';
import { FooterComponent } from './footer/index';
import { StarViewComponent } from './star-view/index';
import { PlacesService } from './places/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, FooterComponent, StarViewComponent],
  exports: [NavbarComponent, FooterComponent, StarViewComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        PlacesService,
        GOOGLE_MAPS_PROVIDERS,
        provideLazyMapsAPILoaderConfig({
          apiKey: 'AIzaSyBE1Bb86PEGx-11LahjWCZS2cFOWMpNseI',
          libraries: ['places']
        })
      ]
    };
  }
}