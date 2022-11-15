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
      })
    );
  }
  RequestWhitHeaders(request: HttpRequest<any>) {
    const Iso = this._SessionStorageService.SessionGetValue('ISO_PAIS');
    const usuarioWeb = this._SessionStorageService.SessionGetValue('usuarioWeb');
    const NombreForm = this._SessionStorageService.SessionGetValue('NombreForm');
    const ApellidoForm = this._SessionStorageService.SessionGetValue('ApellidoForm');
    const EmailForm = this._SessionStorageService.SessionGetValue('EmailForm');
    const IdPaisForm = this._SessionStorageService.SessionGetValue('IdPaisForm');
    const IdRegionForm = this._SessionStorageService.SessionGetValue('IdRegionForm');
    const MovilForm = this._SessionStorageService.SessionGetValue('MovilForm');
    const IdCargoForm = this._SessionStorageService.SessionGetValue('IdCargoForm');
    const IdAreaFormacionForm = this._SessionStorageService.SessionGetValue('IdAreaFormacionForm');
    const IdAreaTrabajoForm = this._SessionStorageService.SessionGetValue('IdAreaTrabajoForm');
    const IdIndustriaForm = this._SessionStorageService.SessionGetValue('IdIndustriaForm');

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
        .set('NombreForm', '' + NombreForm)
        .set('ApellidoForm', '' + ApellidoForm)
        .set('IdEmailForm', '' + EmailForm)
        .set('IdPaisForm', '' + IdPaisForm)
        .set('IdRegionForm', '' + IdRegionForm)
        .set('MovilForm', '' + MovilForm)
        .set('IdCargoForm', '' + IdCargoForm)
        .set('IdAreaFormacionForm', '' + IdAreaFormacionForm)
        .set('IdAreaTrabajoForm', '' + IdAreaTrabajoForm)
        .set('IdIndustriaForm', '' + IdIndustriaForm),
    });
  }
}
