import { isPlatformBrowser } from '@angular/common';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { NotaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
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
  public ListadoNotaProcesarOnline(idPEspecifico:number,grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoNotaProcesarOnline?idPespecifico='+idPEspecifico+ "&grupo=" +grupo);
    }else{
      return EMPTY;
    }
  }
  public Registrar(json:Array<NotaRegistrarDTO>):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/Registrar',json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerCursosProgramaPorIdMatricula(IdMatriculaCabecera:number):Observable<any>{
    console.log(IdMatriculaCabecera)
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosProgramaPorIdMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ListadoAsistenciaProcesar(idPEspecifico:number,grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoAsistenciaProcesar?idPespecifico='+idPEspecifico+ "&grupo=" +grupo);
    }else{
      return EMPTY;
    }
  }
  public ObtenerCursosProgramaPorIdMatriculaOnline(IdMatriculaCabecera:number):Observable<any>{
    console.log(IdMatriculaCabecera)
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosProgramaPorIdMatriculaOnline?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ListadoNotaProcesarV2(idPEspecifico:number,grupo:number,idMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoNotaProcesarV2?idPespecifico='+idPEspecifico+ "&grupo=" +grupo+ "&idMatriculaCabecera=" +idMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public RegistrarNota(json:Array<NotaRegistrarDTO>,idPEspecifico:number,usuario:string):Observable<any>{
    if(this.isBrowser){
      let nota = [];
      for (let i = 0; i < json.length; i++) {
        nota.push({
          Id: json[i].Id.toString(),
          IdEvaluacion: json[i].IdEvaluacion.toString(),
          IdMatriculaCabecera: json[i].IdMatriculaCabecera.toString(),
          Nota: json[i].Nota.toString()
        });
      }
      const notaRequest = {
        notaString: JSON.stringify(nota)
      };
        // Configuración del Content-Type
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // Enviar el objeto como JSON
        // return this.http.post<any>(this.urlBase + '/RegistrarNota', { notaString: notaString }, { headers });
        return this.http.post<any>(`${this.urlBase}/RegistrarNota?IdPEspecifico=${idPEspecifico}`, notaRequest, { headers });
      }else{
      return EMPTY;
    }
  }

}
