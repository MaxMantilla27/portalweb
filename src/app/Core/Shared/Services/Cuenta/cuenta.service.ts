import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Cuenta';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerListaCursosPrueba():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerListaCursosPrueba');
    }else{
      return EMPTY;
    }
  }
  public RegistroProgramaPorIdRegistroPrueba(IdRegistroPrueba:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistroProgramaPorIdRegistroPrueba?IdRegistroPrueba='+IdRegistroPrueba);
    }else{
      return EMPTY;
    }
  }
}
