import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpositorService {
  public urlBase=environment.url_api+'Expositor';
  constructor(private http: HttpClient) { }
  public ListExpositor(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListExpositor?IdBusqueda='+IdBusqueda);
  }
}
