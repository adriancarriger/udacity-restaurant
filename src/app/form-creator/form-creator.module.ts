import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextboxComponent } from './textbox/index';
import { SelectComponent } from './select/index';
import { RatingInputComponent } from './rating-input/index';
import { FormComponent } from './form/index';
import { ValuesPipe } from './values/values.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TextboxComponent,
    SelectComponent,
    RatingInputComponent,
    FormComponent,
    ValuesPipe
  ],
  exports: [
    FormComponent
  ]
})
export class FormCreatorModule { }
