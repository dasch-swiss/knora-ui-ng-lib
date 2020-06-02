import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

export class GNDConstants {
    public static GND_PREFIX = '(DE-588)';
    public static GND_RESOLVER = 'http://d-nb.info/gnd/';

    public static VIAF_PREFIX = '(VIAF)';
    public static VIAF_RESOLVER = 'https://viaf.org/viaf/';
}

/**
 * This directive renders a GND/IAF or a VIAF identifier as a link to the respective resolver.
 */
@Directive({
  selector: '[dspGnd]'
})
export class GndDirective implements OnChanges {

    @Input()
    set dspGnd(value: string) {
        this._gnd = value;
    }

    get dspGnd() {
        return this._gnd;
    }


    // the GND identifier to be rendered
    private _gnd: string;

    constructor(private el: ElementRef) {

    }

    ngOnChanges() {
        if (this._gnd.length < 30) {

            if (this._gnd.indexOf(GNDConstants.GND_PREFIX) === 0) {
                // GND/IAF identifier
                this.el.nativeElement.innerHTML = `<a href="${GNDConstants.GND_RESOLVER + this._gnd.replace(GNDConstants.GND_PREFIX, '')}" target="_blank">${this._gnd}</a>`;
            } else if (this._gnd.indexOf(GNDConstants.VIAF_PREFIX) === 0) {
                // VIAF identifier
                this.el.nativeElement.innerHTML = `<a href="${GNDConstants.VIAF_RESOLVER + this._gnd.replace(GNDConstants.VIAF_PREFIX, '')}" target="_blank">${this._gnd}</a>`;
            } else {
                // no identifier, leave unchanged
                this.el.nativeElement.innerHTML = this._gnd;
            }

        } else {
            // no identifier, leave unchanged
            this.el.nativeElement.innerHTML = this._gnd;
        }

    }

}
