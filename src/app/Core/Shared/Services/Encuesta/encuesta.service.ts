import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ParametroEnvioEncuestaDTO, ParametrosEncuestaDTO } from 'src/app/Core/Models/EncuestaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Encuesta';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerEncuestaEvaluacion(Json:ParametrosEncuestaDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerEncuestaEvaluacion',Json);
    }else{
      return EMPTY;
    }
  }
  public EnviarEncuestaEvaluacion(Json:ParametroEnvioEncuestaDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EnviarEncuestaEvaluacion',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerNuevaEncuestaEvaluacion(Json:ParametrosEncuestaDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerNuevaEncuestaEvaluacion',Json);
    }else{
      return EMPTY;
    }
  }
}
