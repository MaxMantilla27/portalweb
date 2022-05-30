import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CertificadoIntegraService {
  public urlBase=environment.url_api_integra+'CertificadoGeneracionAutomatica';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public GenerarCertificadoPorAlumnoPortalWebPorIdMatricula(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/GenerarCertificadoPorAlumnoPortalWebPorIdMatricula/'+IdMatriculaCabecera);
  }
  public GenerarCertificadoPorAlumnoIdMatriculaCabecera(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/GenerarCertificadoPorAlumnoIdMatriculaCabecera/'+IdMatriculaCabecera);
  }
}
