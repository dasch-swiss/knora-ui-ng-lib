import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-input-test',
    templateUrl: './input-test.component.html',
    styleUrls: ['./input-test.component.scss']
})
export class InputTestComponent implements OnInit, OnChanges {

    @Input() myFirstInput = 'oho';

    private _mySecondInput = 'hi';

    @Input() set mySecondInput(value: string) {
        this._mySecondInput = value;
    }

    get mySecondInput() {
        return this._mySecondInput;
    }

    @Input() myThirdInput?: string;

    constructor() {
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
    }


}
