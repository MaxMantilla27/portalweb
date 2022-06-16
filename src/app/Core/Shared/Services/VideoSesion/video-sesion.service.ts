import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorVideoPlayerDTO } from 'src/app/Core/Models/ErrorVideoPlayerDTO';
import { ParametrosVideoSesionDTO, RegistroVideoUltimaVisualizacionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoSesionService {
  public urlBase=environment.url_api+'VideoSesion';
  constructor(private http: HttpClient) { }

  public ObtenerVideoProgramaCapacitacionSesion(Json:ParametrosVideoSesionDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/ObtenerVideoProgramaCapacitacionSesion',Json);
  }
  public RegistrarUltimaVisualizacionVideo(Json:RegistroVideoUltimaVisualizacionDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/RegistrarUltimaVisualizacionVideo',Json);
  }
  public ObtenerVideoProgramaCapacitacionSesionPrueba(Json:ParametrosVideoSesionDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/ObtenerVideoProgramaCapacitacionSesionPrueba',Json);
  }
  public ObtenerConfiguracionVideoSesion(IdPGeneral:number,Fila:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerConfiguracionVideoSesion?IdPGeneral='+IdPGeneral+'&Fila='+Fila)
  }
  public EnviarErrorVideoPlayer(Json:ErrorVideoPlayerDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/EnviarErrorVideoPlayer',Json);
  }


}
