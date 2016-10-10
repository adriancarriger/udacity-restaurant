import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HomeModule } from './home/home.module';
import { RestaurantModule } from  './restaurant/restaurant.module';
import { LegalModule } from './legal/legal.module';
import { SharedModule } from './shared/shared.module';
import { LoadingModule } from './loading/loading.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    HomeModule,
    RestaurantModule,
    LegalModule,
    SharedModule.forRoot(),
    LoadingModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
