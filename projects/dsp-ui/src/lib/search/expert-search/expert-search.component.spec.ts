import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KnoraApiConfig } from '@dasch-swiss/dsp-js';
import { DspApiConfigToken } from '../../core/core.module';
import { AdvancedSearchParams, AdvancedSearchParamsService } from '../services/advanced-search-params.service';
import { ExpertSearchComponent } from './expert-search.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-expert-search #expSearch (gravsearchQuery)="gravsearchQuery($event)"></dsp-expert-search>`
})
class TestHostComponent implements OnInit {

    @ViewChild('expSearch') expertSearch: ExpertSearchComponent;

    gravsearchQ: string;

    ngOnInit() {
    }

    gravsearchQuery(query: string) {
        this.gravsearchQ = query;
    }

}

describe('ExpertSearchComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    let hostCompDe: DebugElement;

    let searchParamsServiceSpy: jasmine.SpyObj<AdvancedSearchParamsService>;
    let advancedSearchParams: AdvancedSearchParams;

    beforeEach(async(() => {

        const dspConfSpy = new KnoraApiConfig('http', 'localhost', 3333, undefined, undefined, true);

        const spy = jasmine.createSpyObj('SearchParamsService', ['changeSearchParamsMsg']);

        TestBed.configureTestingModule({
            declarations: [
                ExpertSearchComponent,
                TestHostComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            providers: [
                {
                    provide: DspApiConfigToken,
                    useValue: dspConfSpy
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    }
                },
                {
                    provide: AdvancedSearchParamsService,
                    useValue: spy
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;

        searchParamsServiceSpy = TestBed.inject(AdvancedSearchParamsService) as jasmine.SpyObj<AdvancedSearchParamsService>;
        searchParamsServiceSpy.changeSearchParamsMsg.and.callFake((searchParams: AdvancedSearchParams) => {
            advancedSearchParams = searchParams;
        });

        testHostFixture.detectChanges();

        hostCompDe = testHostFixture.debugElement;
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.expertSearch).toBeTruthy();
    });

    it('should init the form with the default query', () => {
        const textarea = hostCompDe.query(By.css('textarea.textarea-field-content'));
        const textareaEle = textarea.nativeElement;

        expect(textareaEle.value).toBe(
            `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`
        );
    });

    it('should reset the form', () => {

        const resetBtn = hostCompDe.query(By.css('button.reset'));
        const textarea = hostCompDe.query(By.css('textarea.textarea-field-content'));

        const resetEle = resetBtn.nativeElement;
        const textareaEle = textarea.nativeElement;

        // delete textarea content displayed by default to make a change
        textareaEle.value = '';
        expect(textareaEle.value).toBe('');

        resetEle.click();

        testHostFixture.detectChanges();

        // reset the textarea content
        expect(textareaEle.value).toBe(
            `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`
        );
    });

    it('should register the query in the params service', () => {
        const expectedGravsearch =
            `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}

             OFFSET 0
             `
            ;
        const submitBtn = hostCompDe.query(By.css('button[type="submit"]'));
        const submitBtnEle = submitBtn.nativeElement;

        submitBtnEle.click();
        testHostFixture.detectChanges();

        expect(searchParamsServiceSpy.changeSearchParamsMsg).toHaveBeenCalledTimes(1);
        expect(advancedSearchParams).toBeDefined();
        expect(advancedSearchParams.generateGravsearch(0)).toEqual(expectedGravsearch);
    });

    it('should emit the Gravsearch query', () => {
        const expectedGravsearch =
            `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}

         OFFSET 0
         `;

        const submitBtn = hostCompDe.query(By.css('button[type="submit"]'));
        const submitBtnEle = submitBtn.nativeElement;

        expect(testHostComponent.gravsearchQ).toBeUndefined();

        submitBtnEle.click();
        testHostFixture.detectChanges();

        expect(testHostComponent.gravsearchQ).toBeDefined();
        expect(testHostComponent.gravsearchQ).toEqual(expectedGravsearch);

    });

    it('should not return an invalid query', () => {
        expect(testHostComponent.expertSearch.expertSearchForm.valid).toBeTruthy();

        const textarea = hostCompDe.query(By.css('textarea.textarea-field-content'));
        const textareaEle = textarea.nativeElement;

        expect(textareaEle.value).toBe(
            `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`
        );

        textareaEle.value =
            `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <http://localhost:3333/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}

OFFSET 0
`;

        textareaEle.dispatchEvent(new Event('input'));
        testHostFixture.detectChanges();

        expect(testHostComponent.expertSearch.expertSearchForm.valid).toBeFalsy();

        const submitForm = testHostComponent.expertSearch.submitQuery();

        expect(submitForm).toBeFalsy();
    });

});
