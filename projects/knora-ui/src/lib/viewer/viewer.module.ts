import { NgModule } from '@angular/core';
import { TextValueAsStringComponent } from './values/text-value/text-value-as-string/text-value-as-string.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';

import { IntValueComponent } from './values/int-value/int-value.component';
import { DisplayEditComponent } from './operations/display-edit/display-edit.component';
import { BooleanValueComponent } from './values/boolean-value/boolean-value.component';
import { DecimalValueComponent } from './values/decimal-value/decimal-value.component';
import { ColorValueComponent } from './values/color-value/color-value.component';
import { UriValueComponent } from './values/uri-value/uri-value.component';
import { IntervalValueComponent } from './values/interval-value/interval-value.component';
import { IntervalInputComponent } from './values/interval-value/interval-input/interval-input.component';
import { ColorPickerComponent } from './values/color-value/color-picker/color-picker.component';
import { PropertyViewComponent } from './views/property-view/property-view.component';
import { ResourceViewComponent } from './views/resource-view/resource-view.component';

@NgModule({
  declarations: [
    TextValueAsStringComponent,
    IntValueComponent,
    DisplayEditComponent,
    BooleanValueComponent,
    ColorValueComponent,
    DecimalValueComponent,
    UriValueComponent,
    IntervalValueComponent,
    IntervalInputComponent,
    ColorPickerComponent,
    PropertyViewComponent,
    ResourceViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    ColorPickerModule
  ],
  exports: [
    TextValueAsStringComponent,
    IntValueComponent,
    DisplayEditComponent,
    BooleanValueComponent,
    ColorValueComponent,
    DecimalValueComponent,
    UriValueComponent,
    IntervalValueComponent,
    ResourceViewComponent
  ]
})
export class ViewerModule {
}
