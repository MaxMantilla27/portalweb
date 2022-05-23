import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForoDTO, ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForoCursoService {
  public urlBase=environment.url_api+'ForoCurso';
  constructor(private http: HttpClient) { }
  public ObtenerForoCurso(IdPGeneral:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerForoCurso?IdPGeneral='+IdPGeneral);
  }
  public InsertarForoCursoPorUsuario(Json:ForoDTO):Observable<any>{
    console.log(Json);
    return this.http.post<any>(this.urlBase+'/InsertarForoCursoPorUsuario',Json);
  }
  public ContenidoPreguntaForoCurso(IdPregunta:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ContenidoPreguntaForoCurso?IdPregunta='+IdPregunta);
  }
  public PartialRespuestaPregunta(IdPGeneral:number,IdPregunta:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/PartialRespuestaPregunta?IdPGeneral='+IdPGeneral+'&IdPregunta='+IdPregunta);
  }
  public EnviarRegistroRespuestaForo(Json:ForoRespuestaDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/ObtenerForoCurso',Json);
  }
}
