import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroVisitaPortalService {

  isBrowser: boolean;
  public urlBase=environment.url_api+'RegistroVisitaPortal';
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerListaRegistroVisitaPortal():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerListaRegistroVisitaPortal');
    }else{
      return EMPTY;
    }
  }

  public ObtenerListaRegistroVisitaPortalPorUsuarioWeb(usuarioWeb: string):Observable<any>{
    if(this.isBrowser){
      const params = new HttpParams().set('usuarioWeb', usuarioWeb);
      return this.http.get<any>(`${this.urlBase}/ObtenerListaRegistroVisitaPortalPorUsuarioWeb`, { params });
    }else{
      return EMPTY;
    }
  }

  public InsertarRegistroVisitaPortal(registroVisita: InsertaRegistroVisitaPortalDTO): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>(`${this.urlBase}/InsertarRegistroVisitaPortal`, registroVisita);
    } else {
      return EMPTY;
    }
  }

}

interface InsertaRegistroVisitaPortalDTO {
  usuarioWeb: string;
  idAlumno?: number | null;
  correo?: string | null;
  nombre?: string | null;
  apellido?: string | null;
  idPais?: number | null;
  telefono?: string | null;
  idCargo?: number | null;
  idAreaFormacion?: number | null;
  idAreaTrabajo?: number | null;
  idIndustria?: number | null;
  usuario: string;
}