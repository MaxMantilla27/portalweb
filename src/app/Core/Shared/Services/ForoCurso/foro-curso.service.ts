import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Output, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ForoDTO, ForoDTOCompleto, ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
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
  // public InsertarForoCursoPorUsuario(Json:ForoDTO):Observable<any>{
  //   if(this.isBrowser){
  //     return this.http.post<any>(this.urlBase+'/InsertarForoCursoPorUsuario',Json);
  //   }else{
  //     return EMPTY;
  //   }
  // }
  public InsertarForoCursoPorUsuario(Json:ForoDTOCompleto):Observable<any>{
    console.log(Json)
    const formData: FormData = new FormData();
    formData.append('IdPrincipal', Json.idPrincipal.toString());
    formData.append('IdCurso', Json.idCurso.toString());
    formData.append('IdPEspecificoPadre', Json.idPEspecificoPadre.toString());
    formData.append('IdPEspecificoHijo', Json.idPEspecificoHijo.toString());
    formData.append('Titulo', Json.titulo.toString());
    formData.append('Contenido', Json.contenido.toString());
    formData.append('IdOrigenForo', Json.idOrigenForo.toString());
    formData.append('IdCapitulo', Json.idCapitulo.toString());
    formData.append('IdSesion', Json.idSesion.toString());
    formData.append('IdSubSesion', Json.idSubSesion.toString());
    formData.append('IdVideo', Json.idVideo.toString());
    formData.append('file', Json.file!);
    const req= new HttpRequest('POST', `${this.urlBase}/InsertarForoCursoPorUsuario`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
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
  // public EnviarRegistroRespuestaForo(Json:ForoRespuestaDTO):Observable<any>{
  //   if(this.isBrowser){
  //     return this.http.post<any>(this.urlBase+'/EnviarRegistroRespuestaForo',Json);
  //   }else{
  //     return EMPTY;
  //   }
  // }
  public EnviarRegistroRespuestaForo(Json:ForoRespuestaDTO):Observable<any>{
    console.log('REGISTRANDO')
    console.log(Json)
    const formData: FormData = new FormData();
    formData.append('idForoCurso', Json.idForoCurso.toString());
    formData.append('idPrincipal', Json.idPrincipal.toString());
    formData.append('idPGeneral', Json.idPGeneral.toString());
    formData.append('idPEspecificoPadre', Json.idPEspecificoPadre.toString());
    formData.append('idPEspecificoHijo', Json.idPEspecificoHijo.toString());
    formData.append('contenido', Json.contenido.toString());
    formData.append('esDocente', Json.esDocente.toString());
    formData.append('estadoAtendido', Json.estadoAtendido.toString());
    formData.append('file', Json.file!);
    const req= new HttpRequest('POST', `${this.urlBase}/EnviarRegistroRespuestaForo`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
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
