import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosPortalService {
  public urlBase=environment.url_api+'DatosPortal';
  constructor(private http: HttpClient) { }
  public ObtenerCombosPortal():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerCombosPortal');
  }
}
