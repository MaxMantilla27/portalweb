import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeccionProgramaService {

  public urlBase=environment.url_api+'SeccionPrograma';
  constructor(private http: HttpClient) { }
  public ObtenerCabeceraProgramaGeneral(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerCabeceraProgramaGeneral?IdBusqueda='+IdBusqueda);
  }
  public ListSeccionPrograma(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListSeccionPrograma?IdBusqueda='+IdBusqueda);
  }
  public ListPrerrequisito(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListPrerrequisito?IdBusqueda='+IdBusqueda);
  }
  public ListCertificacion(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListCertificacion?IdBusqueda='+IdBusqueda);
  }
  public ListMontoPago(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListMontoPago?IdBusqueda='+IdBusqueda);
  }
  public ListProgramaRelacionado(IdPGeneral:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListProgramaRelacionado?IdPGeneral='+IdPGeneral);
  }
  public ListArticuloProgramaRelacionado(IdArticulo:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListArticuloProgramaRelacionado?IdArticulo='+IdArticulo);
  }
}
