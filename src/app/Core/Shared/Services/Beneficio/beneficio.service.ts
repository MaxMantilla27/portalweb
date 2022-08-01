import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { DetallesDatoAdicionalDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Beneficio';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ListBeneficioPrograma(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListBeneficioPrograma?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public ListaBeneficioMatriculaAlumnoActivo(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/listaBeneficioMatriculaAlumnoActivo?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public AgregarDetalleDatosAdicionales(Json:DetallesDatoAdicionalDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/AgregarDetalleDatosAdicionales',Json);
    }else{
      return EMPTY;
    }
  }
}
