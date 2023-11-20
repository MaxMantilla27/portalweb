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
      return this.http.get<any>(this.urlBase+'/RegistroProgramaMatriculadoPorAlumno');
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
  public ListaCursoWebexMatriculadoV2(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaCursoWebexMatriculadoV2?IdMatriculaCabecera='+IdMatriculaCabecera);
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
  public ObtenerSesionesOnlineWebinarDocente():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerSesionesOnlineWebinarDocente');
    }else{
      return EMPTY;
    }
  }

  public ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(IdPespecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerSesionesOnlineWebinarDocentePorIdPespecifico?IdPespecifico='+IdPespecifico);
    }else{
      return EMPTY;
    }
  }
  public ObtenerCursosOnlineWebinarDocentePortalWeb():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosOnlineWebinarDocentePortalWeb');
    }else{
      return EMPTY;
    }
  }
  public ObtenerCursoOnlineWebinarDocentePortalWeb(IdPespecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursoOnlineWebinarDocentePortalWeb?IdPespecifico='+IdPespecifico);
    }else{
      return EMPTY;
    }
  }

  public ObtenerSesionesOnlineWebinarPorIdPespecifico(IdPespecifico:number,IdMatriculaCabcera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerSesionesOnlineWebinarPorIdPespecifico?IdPespecifico='+IdPespecifico+'&IdMatriculaCabcera='+IdMatriculaCabcera);
    }else{
      return EMPTY;
    }
  }
  public ListaCursoWebexMatriculadoCarrerasProfesionales(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaCursoWebexMatriculadoCarrerasProfesionales?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerSesionesOnlineWebinarPorIdPespecificoCarrerasProfesionales(IdPespecifico:number,IdMatriculaCabcera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerSesionesOnlineWebinarPorIdPespecificoCarrerasProfesionales?IdPespecifico='+IdPespecifico+'&IdMatriculaCabcera='+IdMatriculaCabcera);
    }else{
      return EMPTY;
    }
  }
  public ListaTramiteAdministrativoProgramaMatriculadoRegistradoCarreras(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaTramiteAdministrativoProgramaMatriculadoRegistradoCarreras?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerTramitesSolicitadosPorMatriculaCarreras(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTramitesSolicitadosPorMatriculaCarreras?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ValidarInformacionActualizada(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarInformacionActualizada?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ValidarCertificadoEstudiosCompletado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarCertificadoEstudiosCompletado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ValidarGradoBachillerCompletado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarGradoBachillerCompletado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ValidarCertificadoIdiomaAprobado(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarCertificadoIdiomaAprobado?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

}
