import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroObtenerEvaluacionTarea ,ModelTareaEvaluacionTareaDTO, ParametroEnvioTrabajoPares} from 'src/app/Core/Models/TareaEvaluacionDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareaEvaluacionService {
  public urlBase=environment.url_api+'TareaEvaluacion';
  constructor(private http: HttpClient) { }

  public ObtenerEvaluacionTarea(Json:ParametroObtenerEvaluacionTarea):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerEvaluacionTarea',Json);
  }

  public ObtenerEvaluacionProyectoAplicacion(Json:ParametroObtenerEvaluacionTarea):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerEvaluacionProyectoAplicacion',Json);
  }

  public ObtenerEvaluacionTrabajoPares(Json:ParametroObtenerEvaluacionTarea):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerEvaluacionTrabajoPares',Json);
  }
  public EnviarEvaluacionTarea(Json:ModelTareaEvaluacionTareaDTO):Observable<any>{
    console.log(Json)
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
    const req= new HttpRequest('POST', `${this.urlBase}/EnviarEvaluacionTarea`,formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }
  public EnviarCalificacionTrabajoPares(Json:ParametroEnvioTrabajoPares):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnviarCalificacionTrabajoPares',Json);
  }
}
