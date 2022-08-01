import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { TrabajoDeParesActualizacion } from 'src/app/Core/Models/TrabajoDeParesActualizacionDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajoDeParesIntegraService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'TrabajoDePares';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerProgramaGeneralCentroCostoDocente(IdProveedor:number,Calificados:boolean):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerProgramaGeneralCentroCostoDocente?IdProveedor='+IdProveedor+'&Calificados='+Calificados);
    }else{
      return EMPTY;
    }
  }
  public ObtenerAlumnoTrabajoPares(IdProveedor:number,IdPEspecifico:number,IdPGeneralPadre:number):Observable<any>{
    if(this.isBrowser){
      return this.http
            .get<any>(
              this.urlBase+'/ObtenerAlumnoTrabajoPares?IdProveedor='+IdProveedor+'&IdPEspecifico='+IdPEspecifico+'&IdPGeneralPadre='+IdPGeneralPadre);
    }else{
      return EMPTY;
    }
  }
  public ObtenerTrabajoParesPorId(IdTarea:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTrabajoParesPorId?IdTarea='+IdTarea);
    }else{
      return EMPTY;
    }
  }
  public ListadoProgramasDocenteFiltrado():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoProgramasDocenteFiltrado');
    }else{
      return EMPTY;
    }

  }
  public ListadoAlumnosCalificarPorPespecificoCongelado(IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoAlumnosCalificarPorPespecificoCongelado?IdPEspecifico='+IdPEspecifico);
    }else{
      return EMPTY;
    }
  }

  public ListadoActividadesCalificablesDocentePorCurso(idTarea:number ){
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListadoActividadesCalificablesDocentePorCurso?IdTarea='+idTarea);
    }else{
      return EMPTY;
    }

  }
}
