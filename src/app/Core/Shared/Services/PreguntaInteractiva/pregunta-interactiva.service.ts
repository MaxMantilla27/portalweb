import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupoPreguntaFiltroDTO, RegistroPreguntaDTO, ValidaRespuestaPreguntaDTO } from 'src/app/Core/Models/PreguntaInteractivaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreguntaInteractivaService {

  public urlBase=environment.url_api+'PreguntaInteractiva';
  constructor(private http: HttpClient) { }
  public ListaRegistroPreguntaInteractivaPorGrupo(Json:GrupoPreguntaFiltroDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ListaRegistroPreguntaInteractivaPorGrupo',Json);
  }
  public ValidarPreguntaInteractiva(Json:ValidaRespuestaPreguntaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ValidarPreguntaInteractiva',Json);
  }
  public RegistrarPreguntaInteractiva(Json:RegistroPreguntaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/RegistrarPreguntaInteractiva',Json);
  }
}
