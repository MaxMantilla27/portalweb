import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetallesDatoAdicionalDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  public urlBase=environment.url_api+'Beneficio';
  constructor(private http: HttpClient) { }
  public ListBeneficioPrograma(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListBeneficioPrograma?IdBusqueda='+IdBusqueda);
  }
  public ListaBeneficioMatriculaAlumnoActivo(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/listaBeneficioMatriculaAlumnoActivo?IdMatriculaCabecera='+IdMatriculaCabecera);
  }
  public AgregarDetalleDatosAdicionales(Json:DetallesDatoAdicionalDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/AgregarDetalleDatosAdicionales',Json);
  }
}
