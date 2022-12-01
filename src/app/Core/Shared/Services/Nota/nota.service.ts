import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Nota';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ListadoCriteriosEvaluacionPorCurso(IdMatriculaCabecera:number,IdPEspecifico:number,Grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoCriteriosEvaluacionPorCurso?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico+'&Grupo='+Grupo);
    }else{
      return EMPTY;
    }
  }

  public ListadoNotaProcesar(idPEspecifico:number,grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoNotaProcesar?idPespecifico='+idPEspecifico+ "&grupo=" +grupo);
    }else{
      return EMPTY;
    }
  }
}
