import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedioPagoActivoPasarelaService {
  public urlBase=environment.url_api+'MedioPagoActivoPasarela';
  constructor(private http: HttpClient) { }
  public MedioPagoPasarelaPortalCronograma(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/MedioPagoPasarelaPortalCronograma?IdMatriculaCabecera='+IdMatriculaCabecera);
  }

}
