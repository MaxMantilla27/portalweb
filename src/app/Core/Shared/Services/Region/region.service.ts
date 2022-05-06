import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  public urlBase=environment.url_api+'Region';
  constructor(private http: HttpClient) { }

  public ObtenerCiudadesPorPais(IdPais?:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerCiudadesPorPais?IdPais='+IdPais);
  }
}
