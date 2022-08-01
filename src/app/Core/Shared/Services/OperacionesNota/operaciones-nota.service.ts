import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { NotaRegistrarDTO, ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesNotaService {
  isBrowser: boolean;
  public urlBase=environment.url_api_integra+'Operaciones/Nota';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ListadoNotaProcesar(idPEspecifico:number,grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoNotaProcesar/'+idPEspecifico+ "/" +grupo);
    }else{
      return EMPTY;
    }
  }
  public Registrar(json:Array<NotaRegistrarDTO>,idPEspecifico:number,usuario:string):Observable<any>{
    if(this.isBrowser){
      console.log(json)
      const formData: FormData = new FormData();
      formData.append("idPEspecifico", idPEspecifico.toString() );
      formData.append("usuario", usuario );
      for (let i = 0; i < json.length; i++) {
        formData.append('notas[' + i + '][Id]', json[i].Id.toString());
        formData.append('notas[' + i + '][IdEvaluacion]', json[i].IdEvaluacion.toString());
        formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
        formData.append('notas[' + i + '][Nota]', json[i].Nota.toString());
      }
      console.log(formData.get('notas[]'))
      return this.http.post<any>(this.urlBase+'/Registrar',formData);
    }else{
      return EMPTY;
    }
  }
  public Aprobar(json:Array<NotaRegistrarDTO>,idPEspecifico:number,usuario:string,grupo:number):Observable<any>{
    if(this.isBrowser){
      console.log(json)
      const formData: FormData = new FormData();
      formData.append("idPEspecifico", idPEspecifico.toString() );
      formData.append("grupo", grupo.toString() );
      formData.append("usuario", usuario );
      for (let i = 0; i < json.length; i++) {
        formData.append('notas[' + i + '][Id]', json[i].Id.toString());
        formData.append('notas[' + i + '][IdEvaluacion]', json[i].IdEvaluacion.toString());
        formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
        formData.append('notas[' + i + '][Nota]', json[i].Nota.toString());
      }
      console.log(formData.get('notas[]'))
      return this.http.post<any>(this.urlBase+'/Aprobar',formData);
    }else{
      return EMPTY;
    }
  }


  public ListadoAsistenciaProcesar(idPEspecifico:number,grupo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoAsistenciaProcesar/'+idPEspecifico+ "/" +grupo);
    }else{
      return EMPTY;
    }
  }
}
