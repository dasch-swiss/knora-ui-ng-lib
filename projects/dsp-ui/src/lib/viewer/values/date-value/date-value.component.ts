import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CreateDateValue, KnoraDate, KnoraPeriod, ReadDateValue, UpdateDateValue } from '@dasch-swiss/dsp-js';
import {
    FormBuilder,
    FormControl,
    FormGroup
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseValueComponent } from '../base-value.component';
import { DateInputComponent } from './date-input/date-input.component';
import { ValueErrorStateMatcher } from '../value-error-state-matcher';

@Component({
    selector: 'dsp-date-value',
    templateUrl: './date-value.component.html',
    styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent extends BaseValueComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('dateInput') dateInputComponent: DateInputComponent;

    @Input() displayValue?: ReadDateValue;
    @Input() era: boolean;
    @Input() calendar: boolean;

    valueFormControl: FormControl;
    commentFormControl: FormControl;

    form: FormGroup;

    valueChangesSubscription: Subscription;

    customValidators = [];

    matcher = new ValueErrorStateMatcher();

    // will come from the ontology settings when implemented
    ontologyDateSetting: string;

    constructor(@Inject(FormBuilder) private _fb: FormBuilder) {
        super();
    }

    /**
     * Returns true if both dates are the same.
     *
     * @param date1 date for comparison with date2
     * @param date2 date for comparison with date 1
     */
    sameDate(date1: KnoraDate, date2: KnoraDate): boolean {
        return (date1.calendar === date2.calendar && date1.year === date2.year && date1.month === date2.month && date1.day === date2.day);
    }

    standardValueComparisonFunc(initValue: KnoraDate | KnoraPeriod, curValue: KnoraDate | KnoraPeriod | null): boolean {
        let sameValue: boolean;
        if (initValue instanceof KnoraDate && curValue instanceof KnoraDate) {
            sameValue = this.sameDate(initValue, curValue);
        } else if (initValue instanceof KnoraPeriod && curValue instanceof KnoraPeriod) {
            sameValue = this.sameDate(initValue.start, curValue.start) && this.sameDate(initValue.end, curValue.end);
        } else {
            // init value and current value have different types
            sameValue = false;
        }
        return sameValue;
    }

    getInitValue(): KnoraDate | KnoraPeriod | null {
        if (this.displayValue !== undefined) {
            return this.displayValue.date;
        } else {
            return null;
        }
    }

    ngOnInit() {
        // initialize form control elements
        this.valueFormControl = new FormControl(null);

        this.commentFormControl = new FormControl(null);

        this.ontologyDateSetting = 'MM.dd.YYYY';

        // subscribe to any change on the comment and recheck validity
        this.valueChangesSubscription = this.commentFormControl.valueChanges.subscribe(
            data => {
                this.valueFormControl.updateValueAndValidity();
            }
        );

        this.form = this._fb.group({
            dateValue: this.valueFormControl,
            comment: this.commentFormControl
        });

        this.resetFormControl();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.resetFormControl();
    }

    // unsubscribe when the object is destroyed to prevent memory leaks
    ngOnDestroy(): void {
        this.unsubscribeFromValueChanges();
    }

    /**
     * Given a value and a period or Date, populates the value.
     *
     * @param value the value to be populated.
     * @param dateOrPeriod the date or period to read from.
     */
    populateValue(value: UpdateDateValue | CreateDateValue, dateOrPeriod: KnoraDate | KnoraPeriod) {

        if (dateOrPeriod instanceof KnoraDate) {

            value.calendar = dateOrPeriod.calendar;
            value.startEra = dateOrPeriod.era;
            value.startDay = dateOrPeriod.day;
            value.startMonth = dateOrPeriod.month;
            value.startYear = dateOrPeriod.year;

            value.endEra = value.startEra;
            value.endDay = value.startDay;
            value.endMonth = value.startMonth;
            value.endYear = value.startYear;

        } else if (dateOrPeriod instanceof KnoraPeriod) {

            value.calendar = dateOrPeriod.start.calendar;

            value.startEra = dateOrPeriod.start.era;
            value.startDay = dateOrPeriod.start.day;
            value.startMonth = dateOrPeriod.start.month;
            value.startYear = dateOrPeriod.start.year;

            value.endEra = dateOrPeriod.end.era;
            value.endDay = dateOrPeriod.end.day;
            value.endMonth = dateOrPeriod.end.month;
            value.endYear = dateOrPeriod.end.year;

        }
    }

    getNewValue(): CreateDateValue | false {
        if (this.mode !== 'create' || !this.form.valid) {
            return false;
        }

        const newDateValue = new CreateDateValue();

        const dateOrPeriod = this.valueFormControl.value;

        this.populateValue(newDateValue, dateOrPeriod);

        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            newDateValue.valueHasComment = this.commentFormControl.value;
        }

        return newDateValue;
    }

    getUpdatedValue(): UpdateDateValue | false {
        if (this.mode !== 'update' || !this.form.valid) {
            return false;
        }

        const updatedDateValue = new UpdateDateValue();

        updatedDateValue.id = this.displayValue.id;

        const dateOrPeriod = this.valueFormControl.value;

        this.populateValue(updatedDateValue, dateOrPeriod);

        // add the submitted comment to updatedIntValue only if user has added a comment
        if (this.commentFormControl.value !== null && this.commentFormControl.value !== '') {
            updatedDateValue.valueHasComment = this.commentFormControl.value;
        }

        return updatedDateValue;
    }

}
