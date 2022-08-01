import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Tag';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ListTagProgramaRelacionadoPorIdBusqueda(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListTagProgramaRelacionadoPorIdBusqueda?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public ListTagArticuloRelacionadoPorIdWeb(IdWeb:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListTagArticuloRelacionadoPorIdWeb?IdWeb='+IdWeb);
    }else{
      return EMPTY;
    }
  }

}
