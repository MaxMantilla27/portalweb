import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrabajoDeParesActualizacion } from 'src/app/Core/Models/TrabajoDeParesActualizacionDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajoDeParesIntegraService {
  public urlBase=environment.url_api+'TrabajoDePares';
  constructor(private http: HttpClient) { }

  public ObtenerProgramaGeneralCentroCostoDocente(IdProveedor:number,Calificados:boolean):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerProgramaGeneralCentroCostoDocente?IdProveedor='+IdProveedor+'&Calificados='+Calificados);
  }
  public ObtenerAlumnoTrabajoPares(IdProveedor:number,IdPEspecifico:number,IdPGeneralPadre:number):Observable<any>{
    return this.http
          .get<any>(
            this.urlBase+'/ObtenerAlumnoTrabajoPares?IdProveedor='+IdProveedor+'&IdPEspecifico='+IdPEspecifico+'&IdPGeneralPadre='+IdPGeneralPadre);
  }
  public ObtenerTrabajoParesPorId(IdTarea:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerTrabajoParesPorId?IdTarea='+IdTarea);
  }
  public ListadoProgramasDocenteFiltrado():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoProgramasDocenteFiltrado');

  }
  public ListadoAlumnosCalificarPorPespecificoCongelado(IdPEspecifico:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoAlumnosCalificarPorPespecificoCongelado?IdPEspecifico='+IdPEspecifico);
  }

  public ListadoActividadesCalificablesDocentePorCurso(idTarea:number ){
    return this.http.get<any>(this.urlBase+'/ListadoActividadesCalificablesDocentePorCurso?IdTarea='+idTarea);

  }
}
