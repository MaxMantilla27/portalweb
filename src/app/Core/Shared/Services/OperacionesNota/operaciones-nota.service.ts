import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { NotaRegistrarDTO, ParametroNotaRegistrarV3DTO, ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
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


  public RegistrarV3(json:Array<ParametroNotaRegistrarV3DTO>,idPEspecifico:number,usuario:string,retroalimentacion:string,file: File,id:number):Observable<any>{
    if(this.isBrowser){
      console.log(json)
      const formData: FormData = new FormData();
      formData.append("idPEspecifico", idPEspecifico.toString() );
      formData.append("idTarea", id.toString() );
      formData.append("retroalimentacion", retroalimentacion );
      formData.append("usuario", usuario );
      formData.append("archivos", file );
      for (let i = 0; i < json.length; i++) {
        formData.append('notas[' + i + '][Id]', json[i].Id.toString());
        formData.append('notas[' + i + '][IdPespecifico]', json[i].IdPespecifico.toString());
        formData.append('notas[' + i + '][Grupo]', json[i].Grupo.toString());
        formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
        formData.append('notas[' + i + '][IdEsquemaEvaluacionPGeneralDetalle]', json[i].IdEsquemaEvaluacionPGeneralDetalle.toString());
        formData.append('notas[' + i + '][IdParametroEvaluacion]', json[i].IdParametroEvaluacion.toString());
        formData.append('notas[' + i + '][IdEscalaCalificacionDetalle]',json[i].IdEscalaCalificacionDetalle!.toString());
        formData.append('notas[' + i + '][PortalTareaEvaluacionTareaId]', json[i].PortalTareaEvaluacionTareaId!.toString());
        formData.append('notas[' + i + '][EsProyectoAnterior]', json[i].EsProyectoAnterior.toString());
        formData.append('notas[' + i + '][IdProyectoAplicacionEnvioAnterior]', json[i].IdProyectoAplicacionEnvioAnterior!.toString());
        formData.append('notas[' + i + '][NombreArchivoRetroalimentacion]', json[i].NombreArchivoRetroalimentacion.toString());
        formData.append('notas[' + i + '][UrlArchivoSubidoRetroalimentacion]', json[i].UrlArchivoSubidoRetroalimentacion.toString());
      }
      console.log(formData.get('notas[]'))
      return this.http.post<any>(this.urlBase+'/RegistrarV3',formData);
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
