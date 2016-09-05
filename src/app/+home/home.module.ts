import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { StickyScrollDirective } from './sticky-scroll/index';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [HomeComponent, StickyScrollDirective],
    exports: [HomeComponent],
    providers: []
})

export class HomeModule { }
