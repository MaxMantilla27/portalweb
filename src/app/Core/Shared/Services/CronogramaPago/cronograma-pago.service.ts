import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CronogramaPagoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'CronogramaPago';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerCronogramaPago():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCronogramaPago');
    }else{
      return EMPTY;
    }
  }
  public ObtenerCuotaPagoProcesar(ValorTema:number,Nombre:string):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerCuotaPagoProcesar',{headers:new HttpHeaders});
    }else{
      return EMPTY;
    }
  }
  public ObtenerCronogramaPagoAlumno():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCronogramaPagoAlumno');
    }else{
      return EMPTY;
    }
  }
  public ObtenerCronogramaPagoMatricula(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCronogramaPagoMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }

  
  

}
