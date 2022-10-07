import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { GrupoPreguntaFiltroDTO, RegistroPreguntaDTO, ValidaRespuestaPreguntaDTO } from 'src/app/Core/Models/PreguntaInteractivaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreguntaInteractivaService {
  isBrowser: boolean;

  public urlBase=environment.url_api+'PreguntaInteractiva';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public ListaRegistroPreguntaInteractivaPorGrupo(Json:GrupoPreguntaFiltroDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ListaRegistroPreguntaInteractivaPorGrupo',Json);
    }else{
      return EMPTY;
    }
  }
  public ValidarPreguntaInteractiva(Json:ValidaRespuestaPreguntaDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ValidarPreguntaInteractiva',Json);
    }else{
      return EMPTY;
    }
  }
  public RegistrarPreguntaInteractiva(Json:RegistroPreguntaDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/RegistrarPreguntaInteractivaAula',Json);
      return this.http.post<any>(this.urlBase+'/RegistrarPreguntaInteractiva',Json);
    }else{
      return EMPTY;
    }
  }
}
