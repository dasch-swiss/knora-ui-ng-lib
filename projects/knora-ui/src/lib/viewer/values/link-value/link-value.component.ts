import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseValueComponent} from '../base-value.component';
import {CreateLinkValue, ReadLinkValue, ReadResource, UpdateLinkValue, KnoraApiConnection} from '@knora/api';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {KnoraApiConnectionToken} from '../../../core';
import {ignoreElements} from 'rxjs/operators';
@Component({
  selector: 'kui-link-value',
  templateUrl: './link-value.component.html',
  styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {
  private _restrictToResourceClass: string;
  @Input() displayValue?: ReadLinkValue;
  set restrictResourceClass(value: string) {
    this._restrictToResourceClass = value;
  }

  get restrictResourceClass() {
    return this._restrictToResourceClass;
  }
  options: ReadResource[];
  valueFormControl: FormControl;
  commentFormControl: FormControl;
  form: FormGroup;
  linkedResource: ReadResource;
  linkedResourceIRI: string;

  valueChangesSubscription: Subscription;
  // label cannot contain logical operations of lucene index
  customValidators = [Validators.pattern(/^-?\d+$/)];

  constructor(@Inject(FormBuilder) private fb: FormBuilder, @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    super();
  }

  /**
   * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
   * this is to be used for update and new linked resources
   *
   * @param label to be searched
   */
    searchByLabel(searchTerm: string): ReadResource[] {
      // at least 3 characters are required
      if (searchTerm.length >= 3) {

        this.knoraApiConnection.v2.search.doSearchByLabel(searchTerm, 0, {limitToResourceClass: this._restrictToResourceClass} ).subscribe(
          (response: ReadResource[]) => {
            this.options = response;
          });
      } else {
        // clear selection
        this.options = undefined;

      }
      return this.options;
  }

  // show the label of the linked resource
  getInitValue(): ReadResource | null {
    if (this.displayValue !== undefined) {
      return this.displayValue.linkedResource;
    } else {
      return null;
    }
  }
  // override the resetFormControl() from the base component to deal with initial link value label
  resetFormControl(): void {
    super.resetFormControl();

    if (this.valueFormControl !== undefined) {
      if (this.mode === 'read') {

        const initialValue = this.getInitValue();
        const initialComment = this.getInitComment();
        this.valueFormControl.setValue(initialValue.label);
        this.commentFormControl.setValue(initialComment);

        this.valueFormControl.clearValidators();
      } else {
        this.valueFormControl.setValue('');
        this.valueChangesSubscription = this.valueFormControl.valueChanges.subscribe(data => {
          this.options = this.searchByLabel(data);
        });
        this.valueFormControl.clearValidators();
      }
    }
  }

  ngOnInit() {
    // initialize form control elements
    this.valueFormControl = new FormControl(null);

    this.commentFormControl = new FormControl(null);

    // subscribe to any change on the comment and recheck validity
    this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
      data => {
        this.valueFormControl.updateValueAndValidity();
      }
    );

    this.form = this.fb.group({
      linkValue: this.valueFormControl,
      comment: this.commentFormControl
    });
    this.options = [this.displayValue.linkedResource];
    console.log('initial display value')
    console.log(this.displayValue)
    this.resetFormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFormControl();
  }

  // unsubscribe when the object is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }
  getNewValue(): CreateLinkValue | false {
    if (this.mode !== 'create' || !this.form.valid) {
      return false;
    }
    const newLinkValue = new CreateLinkValue();
    // check that resource with given label exists
    newLinkValue.linkedResourceIri = this.linkedResourceIRI;

    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      newLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return newLinkValue;
  }

  getUpdatedValue(): UpdateLinkValue | false {
    if (this.mode !== 'update' || !this.form.valid) {
      return false;
    }
    console.log('update mode')
    const updatedLinkValue = new UpdateLinkValue();
    updatedLinkValue.id = this.displayValue.id;
    updatedLinkValue.linkedResourceIri = this.linkedResourceIRI;
    console.log('updated link value');
    console.log(updatedLinkValue);
    // add the submitted comment to updatedLinkValue only if user has added a comment
    if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
      updatedLinkValue.valueHasComment = this.commentFormControl.value;
    }

    return updatedLinkValue;
  }
  onOptionChange(option: ReadResource) {
      this.setLinkValue(option);
  }

  private setLinkValue(option: ReadResource) {
    console.log('selected option')
    this.valueFormControl.setValue(option.label);
    console.log('chosen option')
    console.log(option)
    this.linkedResourceIRI = option.id;
    this.linkedResource = option;
  }
}
