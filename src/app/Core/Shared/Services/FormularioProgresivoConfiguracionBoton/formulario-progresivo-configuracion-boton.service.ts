import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioProgresivoConfiguracionBotonService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'FormularioProgresivoConfiguracionBoton';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerListaFormularioProgresivoConfiguracionBoton(idFormularioProgresivo: number, idFormularioProgresivoSeccionPortal: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(`${this.urlBase}/ObtenerListaFormularioProgresivoConfiguracionBoton`, {
        params: { idFormularioProgresivo: idFormularioProgresivo, idFormularioProgresivoSeccionPortal: idFormularioProgresivoSeccionPortal }
      });
    } else {
      return EMPTY;
    }
  }

}
