import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
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
  public ProgresoProgramaCursosAulaVirtualAonline(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ProgresoProgramaCursosAulaVirtualAonline?IdMatriculaCabecera='+IdMatriculaCabecera);
  }

  public ObtenerEstructuraEspecifica(Json:ParametrosEstructuraEspecificaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerEstructuraEspecifica',Json);
  }

  public ObtenerEstructuraEspecificaCurso(Json:ParametrosEstructuraEspecificaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerEstructuraEspecificaCurso',Json);
  }
}
