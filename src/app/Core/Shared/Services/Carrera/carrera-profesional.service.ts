import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarreraProfesionalService {
  public urlBase=environment.url_api+'CarreraProfesionalTecnica';
  public urlDetalle=environment.url_api + 'ProgramaDetalleVista';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public GetCarreras(IdCategoria:number):Observable<any>{
    let params = new HttpParams();
    params=params.append("IdCategoria", IdCategoria.toString());
    return this.http.get<any>(this.urlBase+'/ListProfesionCabecera',{ headers:new HttpHeaders(), params: params });
  }
  public GetCarrerasVista(IdCategoria:number):Observable<any> {
    let params = new HttpParams();
    params=params.append("IdCategoria", IdCategoria.toString());
    return this.http.get<any>(this.urlBase+'/ListProfesionVista',{ headers:new HttpHeaders(), params: params });
  }
  public GetCarrerasDetalle(IdBusqueda:number, Nombre:string):Observable<any> {
    let params = new HttpParams();
    params=params.append("IdBusqueda", IdBusqueda.toString());
    params=params.append("Nombre", Nombre.toString());
    console.log(params)
    return this.http.get<any>(this.urlDetalle+'/CarreraProfesionalVista',{ headers:new HttpHeaders(), params: params });
  }
}
