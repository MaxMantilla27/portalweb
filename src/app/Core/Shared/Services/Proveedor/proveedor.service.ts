import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  public urlBase=environment.url_api+'Proveedor';
  constructor(private http: HttpClient) { }

  public ObtenerInformacionProveedor():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerInformacionProveedor');
  }
  public ObtenerForoProveedor():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerForoProveedor');
  }
}
