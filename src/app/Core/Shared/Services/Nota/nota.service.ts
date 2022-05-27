import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  public urlBase=environment.url_api+'Nota';

  constructor(private http: HttpClient) { }

  public ListadoCriteriosEvaluacionPorCurso(IdMatriculaCabecera:number,IdPEspecifico:number,Grupo:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoCriteriosEvaluacionPorCurso?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico+'&Grupo='+Grupo);
  }
}
