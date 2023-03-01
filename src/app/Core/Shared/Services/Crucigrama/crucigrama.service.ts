import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { EvaluacionPromedioCrucigramaDTO, ParametrosCrucigramaVideoSesionDTO, ResetearCrucigramasPreguntasPrueba } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrucigramaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Crucigrama';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerCrucigramaProgramaCapacitacionSesion(Json:ParametrosCrucigramaVideoSesionDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerCrucigramaProgramaCapacitacionSesion',Json);
    }else{
      return EMPTY;
    }
  }
  public EnviarFormularioCrucigrama(Json:EvaluacionPromedioCrucigramaDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EnviarFormularioCrucigramaAula',Json);
      return this.http.post<any>(this.urlBase+'/EnviarFormularioCrucigrama',Json);
    }else{
      return EMPTY;
    }
  }

  public ResetearCrucigramasPreguntasUsuarioPrueba(Json:ResetearCrucigramasPreguntasPrueba):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ResetearCrucigramasPreguntasUsuarioPrueba',Json);
    }else{
      return EMPTY;
    }
  }
  public ResetearEstructuraEspecificaPorMatricula(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ResetearEstructuraEspecificaPorMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
}
