import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarreraProfesionalService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'CarreraProfesionalTecnica';
  public urlDetalle=environment.url_api + 'ProgramaDetalleVista';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GetCarreras(IdCategoria:number):Observable<any>{
    if(this.isBrowser){
      let params = new HttpParams();
      params=params.append("IdCategoria", IdCategoria.toString());
      return this.http.get<any>(this.urlBase+'/ListProfesionCabecera',{ headers:new HttpHeaders(), params: params });
    }else{
      return EMPTY;
    }
  }
  public GetCarrerasVista(IdCategoria:number):Observable<any> {
    if(this.isBrowser){
      let params = new HttpParams();
      params=params.append("IdCategoria", IdCategoria.toString());
      return this.http.get<any>(this.urlBase+'/ListProfesionVista',{ headers:new HttpHeaders(), params: params });
    }else{
      return EMPTY;
    }
  }
  public GetCarrerasDetalle(IdBusqueda:number, Nombre:string):Observable<any> {
    //este es meta
    let params = new HttpParams();
    params=params.append("IdBusqueda", IdBusqueda.toString());
    params=params.append("Nombre", Nombre.toString());
    return this.http.get<any>(this.urlDetalle+'/CarreraProfesionalVista',{ headers:new HttpHeaders(), params: params });
  }
  public GetEducacionTecnicaDetalle(IdBusqueda:number, Nombre:string):Observable<any> {
    //este es meta
    let params = new HttpParams();
    params=params.append("IdBusqueda", IdBusqueda.toString());
    params=params.append("Nombre", Nombre.toString());
    return this.http.get<any>(this.urlDetalle+'/EducacionTecnicaVista',{ headers:new HttpHeaders(), params: params });
  }
}
