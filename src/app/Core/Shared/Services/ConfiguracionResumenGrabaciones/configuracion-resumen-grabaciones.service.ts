import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionResumenGrabacionesService {
  
  isBrowser: boolean;
  public urlBase=environment.url_api+'MatriculaConfiguracionResumenPrograma';
  private idMatriculaCabecera: number | null = null;
  private idPGeneral: number | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setIdMatriculaCabecera(id: number): void {
    this.idMatriculaCabecera = id;
  }

  getIdMatriculaCabecera(): number | null {
    return this.idMatriculaCabecera;
  }

  setIdPGeneral(id: number): void {
    this.idPGeneral = id;
  }

  getIdPGeneral(): number | null {
    return this.idPGeneral;
  }

  public ObtenerListaConfiguracionResumenProgramaPorMatriculaProgramaGeneral(IdMatriculaCabecera: number, IdPGeneral: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        `${this.urlBase}/ObtenerListaConfiguracionResumenProgramaPorMatriculaProgramaGeneral?IdMatriculaCabecera=${IdMatriculaCabecera}&IdPGeneral=${IdPGeneral}`
      );
    } else {
      return EMPTY;
    }
  }

  public InsertarActualizarListaMatriculaConfiguracionResumenPrograma(datos: any): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>(
        `${this.urlBase}/InsertarActualizarListaMatriculaConfiguracionResumenPrograma`, datos
      );
    } else {
      return EMPTY;
    }
  }

}
