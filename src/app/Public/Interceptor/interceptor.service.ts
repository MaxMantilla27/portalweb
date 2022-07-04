import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private _SessionStorageService: SessionStorageService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.RequestWhitHeaders(request));
  }
  RequestWhitHeaders(request: HttpRequest<any>) {
    const Iso = this._SessionStorageService.SessionGetValue('ISO_PAIS');
    const usuarioWeb = this._SessionStorageService.SessionGetValue('usuarioWeb');

    if (this._SessionStorageService.validateTokken()) {
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this._SessionStorageService.GetToken()
        ),
      });
    }
    return request.clone({
      headers: request.headers
        .set('CodigoISO', '' + Iso)
        .set('usuarioWeb', '' + usuarioWeb),
    });
  }
}
