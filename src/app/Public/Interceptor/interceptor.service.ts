import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    private _SessionStorageService: SessionStorageService,
    private router: Router,
    private _HelperService: HelperService,
    private _SnackBarServiceService: SnackBarServiceService,
  ) {}

  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.RequestWhitHeaders(request)).pipe(
      tap((err:any)=>{
        if (err.body!=undefined && err.body.tokenValida == false && err.body.descripcionGeneral!='') {
          this._SessionStorageService.DeleteToken();

          this._SnackBarServiceService.openSnackBar(
            err.body.descripcionGeneral,
            'x',
            10,
            'snackbarCrucigramaerror'
          );
          this._HelperService.enviarDatoCuenta(this.DatoObservable);
          this.router.navigate(['/login']);
        }

        return throwError( err );
      },
      (error : HttpErrorResponse ) => {
          console.log(this.router.url)
          if (error.status == 401 && this.router.url.split('/')[this.router.url.split('/').length-1].toUpperCase()!='LOGIN') {
            this._SessionStorageService.DeleteToken();
            this._HelperService.enviarDatoCuenta(this.DatoObservable);
            this._SnackBarServiceService.openSnackBar(
              "Su sesión ha caducado",
              'x',
              5,
              'snackbarCrucigramaerror'
            );
            this.router.navigate(['/login']);
          }
      })
    );
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
        .set('usuarioWeb', '' + usuarioWeb)

    });
  }
}
