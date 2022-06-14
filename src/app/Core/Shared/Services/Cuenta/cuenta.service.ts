import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  public urlBase=environment.url_api+'Cuenta';
  constructor(private http: HttpClient) { }

  public ObtenerListaCursosPrueba():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerListaCursosPrueba');
  }
  public RegistroProgramaPorIdRegistroPrueba(IdRegistroPrueba:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/RegistroProgramaPorIdRegistroPrueba?IdRegistroPrueba='+IdRegistroPrueba);
  }
}
