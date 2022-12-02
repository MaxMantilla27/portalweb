import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {SharedModule} from './Core/Shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './Public/Interceptor/interceptor.service';
import { HelperService } from './Core/Shared/Services/helper.service';

import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { GlobalErrorHandler } from './global-error.service';
registerLocaleData(localeEs, "es");

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: LOCALE_ID, useValue: "es" },
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    HelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
