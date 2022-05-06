import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoliticaPrivacidadService {

  public urlBase=environment.url_api+'PoliticaPrivacidad';
  constructor(private http: HttpClient) { }

  public ObtenerPoliticaPrivacidad():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerPoliticaPrivacidad');
  }
}
