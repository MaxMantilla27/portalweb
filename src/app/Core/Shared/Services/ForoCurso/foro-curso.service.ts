import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Output, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ForoDTO, ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForoCursoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'ForoCurso';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public ObtenerForoCurso(IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerForoCurso?IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }

  public InsertarForoCursoPorUsuario(Json:ForoDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/InsertarForoCursoPorUsuario',Json);
    }else{
      return EMPTY;
    }
  }
  public ContenidoPreguntaForoCurso(IdPregunta:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ContenidoPreguntaForoCurso?IdPregunta='+IdPregunta);
    }else{
      return EMPTY;
    }
  }
  public PartialRespuestaPregunta(IdPGeneral:number,IdPregunta:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/PartialRespuestaPregunta?IdPGeneral='+IdPGeneral+'&IdPregunta='+IdPregunta);
    }else{
      return EMPTY;
    }
  }
  public EnviarRegistroRespuestaForo(Json:ForoRespuestaDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/EnviarRegistroRespuestaForo',Json);
    }else{
      return EMPTY;
    }
  }
  public PartialRespuestaPreguntaDocente(IdPGeneral:number,IdPregunta:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/PartialRespuestaPreguntaDocente?IdPGeneral='+IdPGeneral+'&IdPregunta='+IdPregunta);
    }else{
      return EMPTY;
    }
  }

  public ObtenerForoCursoProyecto(IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerForoCursoProyecto?IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }
  public ObtenerCursosForoDocentePortalWeb():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosForoDocentePortalWeb');
    }else{
      return EMPTY;
    }
  }
  public ObtenerForosPorCursoDocente(IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerForosPorCursoDocente?IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }
  public ObtenerContenidoForosCurso(IdPregunta:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerContenidoForosCurso?IdPregunta='+IdPregunta);
    }else{
      return EMPTY;
    }
  }
}
