import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  public urlBase=environment.url_api+'Programa';
  constructor(private http: HttpClient) { }
  public EstructuraProgramaPortal(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/EstructuraProgramaPortal?IdBusqueda='+IdBusqueda);
  }
}
