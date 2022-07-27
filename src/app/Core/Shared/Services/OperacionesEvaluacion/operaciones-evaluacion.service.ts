import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluacionRegistrarDTO } from 'src/app/Core/Models/EvaluacionRegistrarDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesEvaluacionService {
  public urlBase=environment.url_api_integra+'Operaciones/Evaluacion';
  constructor(private http: HttpClient) { }

  public ListadoEvaluacionPorPrograma(idPEspecifico:number,grupo:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoEvaluacionPorPrograma/'+idPEspecifico+ "/" +grupo);
  }

  public Registrar(Json:EvaluacionRegistrarDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/Registrar',Json);
  }
  public Actualizar(Json:EvaluacionRegistrarDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/Actualizar',Json);
  }
  public Eliminar(Json:EvaluacionRegistrarDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/Eliminar',Json);
  }
}
