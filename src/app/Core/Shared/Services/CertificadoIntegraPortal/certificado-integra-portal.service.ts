import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CertificadoIntegraPortalService {
  isBrowser: boolean;

  public urlBase=environment.url_api+'CertificadoIntegra';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GenerarCertificadoPorAlumnoPortalWebPorIdMatricula(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/GenerarCertificadoPorAlumnoPortalWebPorIdMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
}
