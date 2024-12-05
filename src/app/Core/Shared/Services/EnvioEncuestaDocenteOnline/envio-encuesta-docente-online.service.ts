import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  EncuestaAvanceDocenteDTO,
} from "src/app/Core/Models/PEspecificoEsquema";

@Injectable({
  providedIn: 'root'
})

export class EnvioEncuestaDocenteOnlineService {

  isBrowser: boolean;
  public urlBase=environment.url_api+'PEspecificoSesionEncuestaDocente';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId:Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
   }

   public ObtenerPreguntasRespuestasEncuestaDocente(
    IdPEspecificoSesion: number, IdProveedor: number
   ): Observable<any>{
    
    console.log({IdPEspecificoSesion,IdProveedor})

      if (this.isBrowser) {
        return this.http.get<any>(
          this.urlBase+
          "/ObtenerPreguntasRespuestasEncuestaDocente?IdPEspecificoSesion="+IdPEspecificoSesion+"&IdProveedor="+IdProveedor
        );
      }else{
        return EMPTY;
      }

   }

   public AgregarPEspecificoSesionEncuestaDocente(EncuestaAvance: EncuestaAvanceDocenteDTO): Observable<any> {
    console.log(EncuestaAvance);
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/AgregarPEspecificoSesionEncuestaDocente" ,EncuestaAvance);
    } else {
      return EMPTY;
    }
  }

}
