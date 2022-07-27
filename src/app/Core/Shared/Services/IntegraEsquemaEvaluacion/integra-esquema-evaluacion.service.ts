import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegraEsquemaEvaluacionService {
  public urlBase=environment.url_api_integra+'EsquemaEvaluacion';
  constructor(private http: HttpClient) { }

  public ListadoAlumnosCalificarPorPespecificoCongelado(idPEspecifico:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoAlumnosCalificarPorPespecificoCongelado/'+idPEspecifico);
  }
}
