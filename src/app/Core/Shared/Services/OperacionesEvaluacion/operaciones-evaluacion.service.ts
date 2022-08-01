import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { EvaluacionRegistrarDTO } from 'src/app/Core/Models/EvaluacionRegistrarDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesEvaluacionService {
  isBrowser: boolean;
  public urlBase=environment.url_api_integra+'Operaciones/Evaluacion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ListadoEvaluacionPorPrograma(idPEspecifico:number,grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoEvaluacionPorPrograma/'+idPEspecifico+ "/" +grupo);
    }else{
      return EMPTY;
    }
  }

  public Registrar(Json:EvaluacionRegistrarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/Registrar',Json);
    }else{
      return EMPTY;
    }
  }
  public Actualizar(Json:EvaluacionRegistrarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/Actualizar',Json);
    }else{
      return EMPTY;
    }
  }
  public Eliminar(Json:EvaluacionRegistrarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/Eliminar',Json);
    }else{
      return EMPTY;
    }
  }
}
