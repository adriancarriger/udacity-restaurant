import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatePipe, PaginationService } from 'ng2-pagination';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { StickyScrollDirective } from './sticky-scroll/index';
import { PaginationComponent } from './pagination/index';
import { SearchPipe } from './search/search.pipe';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    HomeComponent,
    PaginationComponent,
    StickyScrollDirective,
    PaginatePipe,
    SearchPipe
  ],
  exports: [HomeComponent],
  providers: [PaginationService]
})

export class HomeModule { }
