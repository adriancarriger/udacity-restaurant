import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideLazyMapsAPILoaderConfig, AgmCoreModule } from 'angular2-google-maps/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { NavbarComponent } from './navbar/index';
import { FooterComponent } from './footer/index';
import { StarViewComponent } from './star-view/index';
import { PlacesService } from './places/index';
import { GlobalEventsService } from './global-events/index';
import { CroppedImageComponent } from './cropped-image/index';
import { PhonePipe } from './phone/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AgmCoreModule.forRoot(),
    Ng2PageScrollModule
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    StarViewComponent,
    CroppedImageComponent,
    PhonePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    StarViewComponent,
    CroppedImageComponent,
    PhonePipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        PlacesService,
        GlobalEventsService,
        provideLazyMapsAPILoaderConfig({
          apiKey: 'AIzaSyBE1Bb86PEGx-11LahjWCZS2cFOWMpNseI',
          libraries: ['places']
        })
      ]
    };
  }
}
