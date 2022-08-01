import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EstructuraCurricularService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Programa';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GetEstructuraCarreraTecnicaPortal(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      let params = new HttpParams();
      params=params.append("IdBusqueda", IdBusqueda.toString());
      return this.http.get<any>(this.urlBase+'/EstructuraCarreraTecnicaPortal',{ headers:new HttpHeaders(), params: params });
    }else{
      return EMPTY;
    }
  }
}
