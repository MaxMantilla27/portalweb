import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ErrorVideoPlayerDTO } from 'src/app/Core/Models/ErrorVideoPlayerDTO';
import { ParametrosVideoSesionDTO, RegistroVideoUltimaVisualizacionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoSesionService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'VideoSesion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerVideoProgramaCapacitacionSesion(Json:ParametrosVideoSesionDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerVideoProgramaCapacitacionSesion',Json);
    }else{
      return EMPTY;
    }
  }
  public RegistrarUltimaVisualizacionVideo(Json:RegistroVideoUltimaVisualizacionDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/RegistrarUltimaVisualizacionVideo',Json);
    }else{
      return EMPTY;
    }
  }
  public RegistrarUltimaVisualizacionVideoWebApi(Json:RegistroVideoUltimaVisualizacionDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/RegistrarUltimaVisualizacionVideoWebApi',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerVideoProgramaCapacitacionSesionPrueba(Json:ParametrosVideoSesionDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerVideoProgramaCapacitacionSesionPrueba',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerConfiguracionVideoSesion(IdPGeneral:number,Fila:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerConfiguracionVideoSesion?IdPGeneral='+IdPGeneral+'&Fila='+Fila)
    }else{
      return EMPTY;
    }
  }
  public EnviarErrorVideoPlayer(Json:ErrorVideoPlayerDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/EnviarErrorVideoPlayer',Json);
    }else{
      return EMPTY;
    }
  }


}
