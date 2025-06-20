 import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
  RecaptchaFormsModule
} from 'ng-recaptcha';
import { GoogleMapsModule } from '@angular/google-maps';

// Component
import { AppComponent } from './app.component';

// State
import { LoaderState } from './shared/state/loader.state';
import { NotificationState } from './shared/state/notification.state';
import { AttachmentState } from './shared/state/attachment.state';
import { SettingState } from './shared/state/setting.state';
import { MenuState } from './shared/state/menu.state';
import { DashboardState } from './shared/state/dashboard.state';
import { AccountState } from './shared/state/account.state';
import { CountryState } from './shared/state/country.state';
import { StateState } from './shared/state/state.state';

import { SettingService } from './shared/services/setting.service';
import {BrandState} from './shared/state/brand.state';
import {ModelState} from './shared/state/model.state';
import {FormsModule} from '@angular/forms';
import {SearchFilterPipe} from './core/pipes/search-filter.pipe';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

function appLoadFactory(config: SettingService) {
  return () => config.getReCaptchaConfig();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    GoogleMapsModule,
    FormsModule,

    NgxsModule.forRoot([
      LoaderState,
      MenuState,
      NotificationState,
      DashboardState,
      AccountState,
      CountryState,
      BrandState,
      StateState,
      ModelState,
      SettingState,
      AttachmentState
    ]),
    NgxsStoragePluginModule.forRoot({
      key: [
        'auth',
        'dashboard',
        'notification',
        'account',
        'country',
        'state',
        'setting'
      ]
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true
    }),
    SharedModule,
    CoreModule,
    LoadingBarRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useFactory: (config: SettingService): RecaptchaSettings => {
        return { siteKey: config.reCaptchaConfig?.site_key };
      },
      deps: [SettingService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appLoadFactory,
      deps: [SettingService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
