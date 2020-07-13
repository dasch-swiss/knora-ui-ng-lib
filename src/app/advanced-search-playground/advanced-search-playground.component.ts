import { Component, Inject, OnInit } from '@angular/core';
import { AdvancedSearchParamsService, DspApiConnectionToken } from '@dasch-swiss/dsp-ui';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, LogoutResponse } from '@dasch-swiss/dsp-js';

@Component({
    selector: 'app-advanced-search-playground',
    templateUrl: './advanced-search-playground.component.html',
    styleUrls: ['./advanced-search-playground.component.scss']
})
export class AdvancedSearchPlaygroundComponent implements OnInit {

    loading: boolean;

    constructor(private _advancedSearchParamsService: AdvancedSearchParamsService,
                @Inject(DspApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.knoraApiConnection.v2.auth.logout().subscribe(
            (response: ApiResponseData<LogoutResponse>) => {
                this.loading = false;
            },
            (error: ApiResponseError) => {
                console.error(error);
            });
    }

    submitQuery(gravsearchQuery: string) {
        console.log('Output: ', gravsearchQuery);

        console.log('search params', this._advancedSearchParamsService.getSearchParams().generateGravsearch(1));
    }

}
