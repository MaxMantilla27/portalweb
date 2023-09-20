import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ParametroNotaRegistrarV3DTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ParametroObtenerEvaluacionTarea ,ModelTareaEvaluacionTareaDTO, ParametroEnvioTrabajoPares, ParametroEnvioCriterioReflexivo, DevolverProyectoDTO} from 'src/app/Core/Models/TareaEvaluacionDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareaEvaluacionService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'TareaEvaluacion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerEvaluacionTarea(Json:ParametroObtenerEvaluacionTarea):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerEvaluacionTarea',Json);
    }else{
      return EMPTY;
    }
  }
  public DevolverProyecto(Json:DevolverProyectoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/DevolverProyecto',Json);
    }else{
      return EMPTY;
    }
  }

  public ObtenerEvaluacionProyectoAplicacion(Json:ParametroObtenerEvaluacionTarea):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerEvaluacionProyectoAplicacion',Json);
    }else{
      return EMPTY;
    }
  }

  public ObtenerEvaluacionTrabajoPares(Json:ParametroObtenerEvaluacionTarea):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerEvaluacionTrabajoPares',Json);
    }else{
      return EMPTY;
    }
  }
  public ListaPgeneralProyectoAplicacionAnexo(IdPgeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaPgeneralProyectoAplicacionAnexo?IdPgeneral='+IdPgeneral);
    }else{
      return EMPTY;
    }
  }
  public EnviarEvaluacionTarea(Json:ModelTareaEvaluacionTareaDTO):Observable<any>{
    const formData: FormData = new FormData();
    formData.append('file', Json.file);
    formData.append('IdPGeneral', Json.idPGeneral.toString());
    formData.append('IdPrincipal', Json.idPrincipal.toString());
    formData.append('IdPEspecificoPadre', Json.idPEspecificoPadre.toString());
    formData.append('IdPEspecificoHijo', Json.idPEspecificoHijo.toString());
    formData.append('IdEvaluacion', Json.idEvaluacion.toString());
    formData.append('IdTipoEvaluacionTrabajo', Json.idTipoEvaluacionTrabajo.toString());
    formData.append('IdEsquemaEvaluacionPGeneralDetalle', Json.idEsquemaEvaluacionPGeneralDetalle.toString());
    formData.append('IdEsquemaEvaluacionPGeneralDetalle_Anterior', Json.idEsquemaEvaluacionPGeneralDetalle_Anterior.toString());
    formData.append('IdMatriculaCabecera', Json.idMatriculaCabecera.toString());
    const req= new HttpRequest('POST', `${this.urlBase}/EnviarEvaluacionTarea`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }
  public EnviarCalificacionTrabajoPares(Json:ParametroEnvioTrabajoPares):Observable<any>{
    const formData: FormData = new FormData();
    formData.append('file', Json.file);
    formData.append('IdEvaluacion', Json.IdEvaluacion.toString());
    formData.append('IdParametroEvaluacion', Json.IdParametroEvaluacion.toString());
    formData.append('IdEscalaCalificacionDetalle', Json.IdEscalaCalificacionDetalle.toString());
    formData.append('ValorCalificado', Json.ValorCalificado.toString());
    formData.append('IdEsquemaEvaluacionPGeneralDetalle', Json.IdEsquemaEvaluacionPGeneralDetalle.toString());
    formData.append('Retroalimentacion', Json.Retroalimentacion.toString());
    const req= new HttpRequest('POST', `${this.urlBase}/EnviarCalificacionTrabajoPares`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }
  public EnviarCalificacionProyectoEvaluacion(Json:ParametroNotaRegistrarV3DTO):Observable<any>{
    console.log(Json)
    const formData: FormData = new FormData();
    formData.append('file', Json.file!);
    formData.append('PortalTareaEvaluacionTareaId', Json.PortalTareaEvaluacionTareaId!.toString());
    formData.append('IdEscalaCalificacionDetalle', Json.IdEscalaCalificacionDetalle!.toString());
    formData.append('IdParametroEvaluacion', Json.IdParametroEvaluacion.toString());
    formData.append('IdPespecifico', Json.IdPespecifico.toString());
    formData.append('IdMatriculaCabecera', Json.IdMatriculaCabecera.toString());
    formData.append('Grupo', Json.Grupo.toString());
    formData.append('NombreArchivoRetroalimentacion', Json.NombreArchivoRetroalimentacion.toString());
    formData.append('UrlArchivoSubidoRetroalimentacionz', Json.UrlArchivoSubidoRetroalimentacion.toString());
    formData.append('Retroalimentacion', Json.Retroalimentacion!.toString());
    const req= new HttpRequest('POST', `${this.urlBase}/EnviarCalificacionProyectoEvaluacion`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }

  public EnviarCriterioReflexivo(Json:ParametroEnvioCriterioReflexivo):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/EnviarCriterioReflexivo',Json);
    }else{
      return EMPTY;
    }
  }

  public DeleteEvaluacionTareaEvaluacionTarea(IdTareaEvaluacionTarea:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/DeleteEvaluacionTareaEvaluacionTarea?IdTareaEvaluacionTarea='+IdTareaEvaluacionTarea);
    }else{
      return EMPTY;
    }
  }

  public ActualizarCalificacionProyectoEvaluacion(Json:ParametroNotaRegistrarV3DTO):Observable<any>{
    console.log(Json)
    const formData: FormData = new FormData();
    formData.append('file', Json.file!);
    formData.append('PortalTareaEvaluacionTareaId', Json.PortalTareaEvaluacionTareaId!.toString());
    formData.append('IdEscalaCalificacionDetalle', Json.IdEscalaCalificacionDetalle!.toString());
    formData.append('IdParametroEvaluacion', Json.IdParametroEvaluacion.toString());
    formData.append('IdPespecifico', Json.IdPespecifico.toString());
    formData.append('IdMatriculaCabecera', Json.IdMatriculaCabecera.toString());
    formData.append('Grupo', Json.Grupo.toString());
    formData.append('NombreArchivoRetroalimentacion', Json.NombreArchivoRetroalimentacion.toString());
    formData.append('UrlArchivoSubidoRetroalimentacionz', Json.UrlArchivoSubidoRetroalimentacion.toString());
    formData.append('Retroalimentacion', Json.Retroalimentacion!.toString());
    const req= new HttpRequest('POST', `${this.urlBase}/ActualizarCalificacionProyectoEvaluacion`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }

}
