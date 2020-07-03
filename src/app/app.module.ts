import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    DspActionModule,
    DspApiConfigToken,
    DspApiConnectionToken,
    DspCoreModule,
    DspSearchModule,
    DspViewerModule
} from '@dasch-swiss/dsp-ui';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { ActionPlaygroundComponent } from './action-playground/action-playground.component';
import { AppInitService } from './app-init.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModifyComponent } from './modify/modify.component';
import { ReadComponent } from './read/read.component';
import { SearchPlaygroundComponent } from './search-playground/search-playground.component';
import { SearchResultsComponent } from './search-playground/search-results/search-results.component';
import { KnoraApiConnection } from '@dasch-swiss/dsp-js';
import { SessionService } from '../../projects/dsp-ui/src/lib/core/session.service';



export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ModifyComponent,
    ReadComponent,
    ActionPlaygroundComponent,
    SearchPlaygroundComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DspCoreModule,
    DspViewerModule,
    DspActionModule,
    DspSearchModule,
    MatJDNConvertibleCalendarDateAdapterModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    },
    {
      provide: DspApiConfigToken,
      useFactory: (appInitService: AppInitService) => appInitService.dspApiConfig,
      deps: [AppInitService]
    },
    {
      provide: DspApiConnectionToken,
      useFactory: (appInitService: AppInitService) => new KnoraApiConnection(appInitService.dspApiConfig),
      deps: [AppInitService]
    },
    {
      provide: SessionService,
      useClass: SessionService,
      deps: [DspApiConnectionToken, DspApiConfigToken]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
