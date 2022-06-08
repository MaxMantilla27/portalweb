import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatosAlumnoValidacionDTO, InsertarRegistroEnvioFisicoDTO } from 'src/app/Core/Models/CertificadoDTO';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {
  public urlBase=environment.url_api+'Certificado';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public ObtenerDatosCertificado(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerDatosCertificado?IdMatriculaCabecera='+IdMatriculaCabecera);
  }
  public InsertarValidacionDatosAlumno(Json:DatosAlumnoValidacionDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/InsertarValidacionDatosAlumno',Json);
  }
  public ObtenerDatosCertificadoEnvio(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerDatosCertificadoEnvio?IdMatriculaCabecera='+IdMatriculaCabecera);
  }
  public RegistrarSolicitudCertificadoFisico(Json:InsertarRegistroEnvioFisicoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/RegistrarSolicitudCertificadoFisico',Json);
  }
}
