import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { DatosAlumnoValidacionCarreraDTO, DatosAlumnoValidacionDTO, DatosCertificadoIdiomaAlumnoValidacionCarreraDTO, InsertarRegistroEnvioFisicoDTO } from 'src/app/Core/Models/CertificadoDTO';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Certificado';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerDatosCertificado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerDatosCertificado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public InsertarValidacionDatosAlumno(Json:DatosAlumnoValidacionDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/InsertarValidacionDatosAlumno',Json);
    }else{
      return EMPTY;
    }
  }



  public InsertarCertificadoIdiomaAlumnoCarrera(Json: DatosCertificadoIdiomaAlumnoValidacionCarreraDTO): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      formData.append("Usuario", "--");
      formData.append("IdALumno", "0");
      formData.append("file", Json.file);
      formData.append("IdMatriculaCabecera", Json.IdMatriculaCabecera.toString());
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/InsertarCertificadoIdiomaAlumnoCarrera`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
  public InsertarValidacionDatosAlumnoCarrera(Json: DatosAlumnoValidacionCarreraDTO): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      formData.append("Nombres", Json.Nombres);
      formData.append("Apellidos", Json.Apellidos);
      formData.append("Usuario", "--");
      formData.append("file", Json.file);
      formData.append("IdMatriculaCabecera", Json.IdMatriculaCabecera.toString());
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/InsertarValidacionDatosAlumnoCarrera`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
  public ObtenerDatosCertificadoEnvio(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerDatosCertificadoEnvio?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerImagenAlumno(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerImagenAlumno?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

  public ObtenerDatosCertificadoIrcaEnvio(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerDatosCertificadoIrcaEnvio?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

  public RegistrarSolicitudCertificadoFisico(Json:InsertarRegistroEnvioFisicoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/RegistrarSolicitudCertificadoFisico',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerInformacionAlumnoCertificado(idMatriculaCabecera:number,codigoCertificado:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerInformacionAlumnoCertificado?idMatriculaCabecera='+idMatriculaCabecera+'&codigoCertificado='+codigoCertificado);
    }else{
      return EMPTY;
    }
  }
  public ObtenerCertificadoIdiomaAlumno(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCertificadoIdiomaAlumno?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }


}
