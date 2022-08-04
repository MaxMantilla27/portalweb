import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DatosPerfilService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'DatosPerfil';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public DatosPerfil():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/DatosPerfil');
    }else{
      return EMPTY;
    }
  }
  public RegistroProgramaMatriculado():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistroProgramaMatriculado');
    }else{
      return EMPTY;
    }
  }
  public RegistroProgramaMatriculadoPorIdMatricula(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistroProgramaMatriculadoPorIdMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

  public ListaWebinarProgramaMatriculadoRegistrado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaWebinarProgramaMatriculadoRegistrado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ListaTramiteAdministrativoProgramaMatriculadoRegistrado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaTramiteAdministrativoProgramaMatriculadoRegistrado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerTramitesSolicitadosPorMatricula(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTramitesSolicitadosPorMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ListaCursoWebexMatriculado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaCursoWebexMatriculado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ListaSimuladorAsignadoMatriculado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaSimuladorAsignadoMatriculado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

}
