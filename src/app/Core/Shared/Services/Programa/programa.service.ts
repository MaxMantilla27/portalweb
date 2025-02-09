import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Programa';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public EstructuraProgramaPortal(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/EstructuraProgramaPortal?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
  public VistaPreviaProgramaPadrePortal(PrimerCurso:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/VistaPreviaProgramaPadrePortal?PrimerCurso='+PrimerCurso);
    }else{
      return EMPTY;
    }
  }
  public VistaPreviaProgramaPortal(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/VistaPreviaProgramaPortal?IdBusqueda='+IdBusqueda);
    }else{
      return EMPTY;
    }
  }
}
