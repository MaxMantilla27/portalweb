import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ParametrosEstructuraEspecificaAccesoPruebaDTO, ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaContenidoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'ProgramaContenido';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerListadoProgramaContenido(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerListadoProgramaContenido?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerProgresoAulaVirtual(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerProgresoAulaVirtual?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ProgresoProgramaCursosAulaVirtualAonline(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ProgresoProgramaCursosAulaVirtualAonline?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

  public ObtenerEstructuraEspecifica(Json:ParametrosEstructuraEspecificaDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerEstructuraEspecifica',Json);
    }else{
      return EMPTY;
    }
  }

  public ObtenerEstructuraEspecificaCurso(Json:ParametrosEstructuraEspecificaDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerEstructuraEspecificaCurso',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerCodigoMatriculaAlumno(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCodigoMatriculaAlumno?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public MigrarEstadoVideoEstructuraPorCurso(IdMatriculaCabecera:number,IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/MigrarEstadoVideoEstructuraPorCurso?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }
  public ObtenerListadoProgramaContenidoPrueba(IdRegistroPrueba:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerListadoProgramaContenidoPrueba?IdRegistroPrueba='+IdRegistroPrueba+'&IdPEspecifico='+IdPEspecifico);
    }else{
      return EMPTY;
    }
  }
  public ConseguirEstructuraPorPrograma(IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ConseguirEstructuraPorPrograma?IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }

  public listaRegistroVideoSesionProgramaSincronico(IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/listaRegistroVideoSesionProgramaSincronico?IdPEspecifico='+IdPEspecifico,{});
    }else{
      return EMPTY;
    }
  }
  public ObtenerEstructuraEspecificaCursoAccesoPrueba(Json:ParametrosEstructuraEspecificaAccesoPruebaDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerEstructuraEspecificaCursoAccesoPrueba',Json);
    }else{
      return EMPTY;
    }
  }
  public VerificarCursosCongelados(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/VerificarCursosCongelados?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerEstructuraEspecificaCursoSincronico(Json:ParametrosEstructuraEspecificaDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerEstructuraEspecificaCursoSincronico',Json);
    }else{
      return EMPTY;
    }
  }

  public ValidarCalificacionesMatriculaPorPgeneral(IdMatriculaCabecera:number,IdPgeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarCalificacionesMatriculaPorPgeneral?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPgeneral='+IdPgeneral);
    }else{
      return EMPTY;
    }
  }
  public ActualizarTareaParametroEvaluacionProyectosNota(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ActualizarTareaParametroEvaluacionProyectosNota?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
}
