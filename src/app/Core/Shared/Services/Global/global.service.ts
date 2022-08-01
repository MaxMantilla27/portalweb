import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Global';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public RegistroInteraccionInicial():Observable<any>{
    console.log('--------')
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistroInteraccionInicial');
    }else{
      return EMPTY;
    }
  }
  public ObtenerCodigoIso():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCodigoIso');
    }else{
      return EMPTY;
    }
  }

  public InsertarContactoPortal():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/InsertarContactoPortal');
    }else{
      return EMPTY;
    }
  }
  public ObtenerIdAlumnoPorUsuario():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerIdAlumnoPorUsuario');
    }else{
      return EMPTY;
    }
  }
}
