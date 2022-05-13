import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaContenidoService {

  public urlBase=environment.url_api+'ProgramaContenido';
  constructor(private http: HttpClient) { }
  public ObtenerListadoProgramaContenido(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerListadoProgramaContenido?IdMatriculaCabecera='+IdMatriculaCabecera);
  }
  public ObtenerProgresoAulaVirtual(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerProgresoAulaVirtual?IdMatriculaCabecera='+IdMatriculaCabecera);
  }
}
