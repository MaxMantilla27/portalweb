import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpositorService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Expositor';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public ListExpositor(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListExpositor?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
}
