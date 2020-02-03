import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent, valueChangedValidator} from '../../base-value.component';
import {CreateTextValueAsString, ReadTextValueAsString, UpdateTextValueAsString} from '@knora/api';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'lib-text-value-as-string',
  templateUrl: './text-value-as-string.component.html',
  styleUrls: ['./text-value-as-string.component.scss']
})
export class TextValueAsStringComponent extends BaseValueComponent implements OnInit, OnChanges {

  @Input() displayValue?: ReadTextValueAsString;

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    super();
  }

  getInitValue(): string | null {

    if (this.displayValue !== undefined) {
      return this.displayValue.text;
    } else {
      return null;
    }
  }

  ngOnInit() {

    // initialize form control elements
    this.valueFormControl = new FormControl(null);
    this.commentFormControl = new FormControl(null);

    this.form = this.fb.group({
      textValue: this.valueFormControl,
      comment: this.commentFormControl
    });

    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {

    // resets values and validators in form controls when input displayValue or mode changes
    // at the first call of ngOnChanges, form control elements are not initialized yet
    if (this.valueFormControl !== undefined && this.commentFormControl !== undefined) {
      this.resetFormControl();
    }
  }

  getNewValue(): CreateTextValueAsString | false {

    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }

    const newTextValue = new CreateTextValueAsString();

    newTextValue.text = this.valueFormControl.value;

    if (this.commentFormControl.value !== null) {
      newTextValue.valueHasComment = this.commentFormControl.value;
    }

    return newTextValue;

  }

  getUpdatedValue(): UpdateTextValueAsString | false {

    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }

    const updatedTextValue = new UpdateTextValueAsString();

    updatedTextValue.id = this.displayValue.id;

    updatedTextValue.text = this.valueFormControl.value;

    if (this.commentFormControl.value !== null) {
      updatedTextValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedTextValue;
  }
}
