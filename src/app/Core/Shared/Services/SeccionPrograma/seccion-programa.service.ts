import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeccionProgramaService {
  isBrowser: boolean;

  public urlBase=environment.url_api+'SeccionPrograma';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerCabeceraProgramaGeneral(IdBusqueda:number):Observable<any>{
    //este es meta
    return this.http.get<any>(this.urlBase+'/ObtenerCabeceraProgramaGeneral?IdBusqueda='+IdBusqueda);
  }
  public ListSeccionPrograma(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListSeccionPrograma?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public ListPrerrequisito(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListPrerrequisito?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public ListCertificacion(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListCertificacion?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public ListMontoPago(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListMontoPago?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public ListProgramaRelacionado(IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListProgramaRelacionado?IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }
  public ListArticuloProgramaRelacionado(IdArticulo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListArticuloProgramaRelacionado?IdArticulo='+IdArticulo);
    }else{
      return EMPTY;
    }
  }
  public ListMontoPagoCompleto(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListMontoPagoCompleto?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
}
