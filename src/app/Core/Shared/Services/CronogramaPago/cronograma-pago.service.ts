import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CronogramaPagoService {
  public urlBase=environment.url_api+'CronogramaPago';
  constructor(private http: HttpClient) { }
  public ObtenerCronogramaPago():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerCronogramaPago');
  }
  public ObtenerCuotaPagoProcesar(ValorTema:number,Nombre:string):Observable<any>{
    return this.http.post<any>(this.urlBase+'/ObtenerCuotaPagoProcesar',{headers:new HttpHeaders});
  }
}
