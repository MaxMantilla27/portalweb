import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { PEspecificoSesionRecursoConectividadSaveDTO } from 'src/app/Core/Models/PEspecificoSesionRecursoConectividadSaveDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PEspecificoSesionRecursoConectividadService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'PEspecificoSesionRecursoConectividad';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerPEspecificoSesionRecursoConectividad(IdPEspecificoSesion:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerPEspecificoSesionRecursoConectividad?IdPEspecificoSesion='+IdPEspecificoSesion);
    } else {
      return EMPTY;
    }
  }
  public ObtenerTipoExamen():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTipoExamen');
    } else {
      return EMPTY;
    }
  }
  public ObtenerTipoDispositivo():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTipoDispositivo');
    } else {
      return EMPTY;
    }
  }
  public ObtenerTipoAmbienteClase():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTipoAmbienteClase');
    } else {
      return EMPTY;
    }
  }
  public AgregarPEspecificoSesionRecursoConectividad(Json:PEspecificoSesionRecursoConectividadSaveDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/AgregarPEspecificoSesionRecursoConectividad',Json);
    }else{
      return EMPTY;
    }
  }
}
