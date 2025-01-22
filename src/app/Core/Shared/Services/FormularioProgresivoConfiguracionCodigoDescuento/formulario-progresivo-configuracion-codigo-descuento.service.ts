import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioProgresivoConfiguracionCodigoDescuentoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'FormularioProgresivoConfiguracionCodigoDescuento';

  constructor(
    private http: HttpClient,
     @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ProcesoInsertarActualizarCodigoDescuento(datosRegistro: InsertaActualizaRegistroVisitaPortalDTO):Observable<any>{
    if (this.isBrowser) {
      const params = new HttpParams()
        .set('Accion', datosRegistro.accion.toString())
        .set('Correo', datosRegistro.correo);
      return this.http.get<any>(`${this.urlBase}/ProcesoInsertarActualizarCodigoDescuento`, { params });
    } else {
      return EMPTY;
    }
  }

  public ObtenerCodigoDescuento(correo: string):Observable<any>{
    if(this.isBrowser){
      const params = new HttpParams().set('correo', correo);
      return this.http.get<any>(`${this.urlBase}/ObtenerCodigoDescuento`, { params });
    }else{
      return EMPTY;
    }
  }
}

interface InsertaActualizaRegistroVisitaPortalDTO {
  accion: number;
  correo: string;
}