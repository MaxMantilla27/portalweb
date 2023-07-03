import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { datosAlumnoEnvioDTO } from 'src/app/Core/Models/AlumnoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Asistencia';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerAsistenciaAlumno(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistencia?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);    
    } else {
      return EMPTY;
    }
  }

}

