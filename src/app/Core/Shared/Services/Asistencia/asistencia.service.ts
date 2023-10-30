import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { datosAlumnoEnvioDTO } from 'src/app/Core/Models/AlumnoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Asistencia';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerAsistencia(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistencia?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);
    } else {
      return EMPTY;
    }
  }

  public ObtenerAsistenciasAlumnoOnline(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistenciasAlumnoOnline?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);
    } else {
      return EMPTY;
    }
  }
  public ObtenerAsistenciasAlumnoOnlineCarrerasProfesionales(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistenciasAlumnoOnlineCarrerasProfesionales?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);
    } else {
      return EMPTY;
    }
  }
  public ObtenerAsistenciaCarrerasProfesionales(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistenciaCarrerasProfesionales?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);
    } else {
      return EMPTY;
    }
  }
  public RegistrarAsistenciaMatricula(IdMatriculaCabecera:number,IdPEspecificoSesion:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistrarAsistenciaMatricula?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecificoSesion='+IdPEspecificoSesion);
    } else {
      return EMPTY;
    }
  }
}

