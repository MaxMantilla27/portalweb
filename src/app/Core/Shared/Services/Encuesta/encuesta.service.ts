import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroEnvioEncuestaDTO, ParametrosEncuestaDTO } from 'src/app/Core/Models/EncuestaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  public urlBase=environment.url_api+'Encuesta';
  constructor(private http: HttpClient) { }

  public ObtenerEncuestaEvaluacion(Json:ParametrosEncuestaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerEncuestaEvaluacion',Json);
  }
  public EnviarEncuestaEvaluacion(Json:ParametroEnvioEncuestaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnviarEncuestaEvaluacion',Json);
  }
}
