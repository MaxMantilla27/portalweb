import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public urlBase=environment.url_api+'Global';
  constructor(private http: HttpClient) { }

  public RegistroInteraccionInicial():Observable<any>{
    return this.http.get<any>(this.urlBase+'/RegistroInteraccionInicial');
  }
  public ObtenerCodigoIso():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerCodigoIso');
  }

  public InsertarContactoPortal():Observable<any>{
    console.log('-----------')
    return this.http.get<any>(this.urlBase+'/InsertarContactoPortal');
  }
}
