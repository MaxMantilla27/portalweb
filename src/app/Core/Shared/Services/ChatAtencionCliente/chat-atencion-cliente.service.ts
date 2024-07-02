
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatAtencionClienteService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'ChatAtencionCliente';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerCursosAlumnoMatriculado():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosAlumnoMatriculado');
    }else{
      return EMPTY;
    }
  }
  public ObtenerAreasCapacitacionChatAtc():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAreasCapacitacionChatAtc');
    }else{
      return EMPTY;
    }
  }
  public ListaProgramasFiltroChatAtc(IdAreaCapacitacion:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaProgramasFiltroChatAtc?IdAreaCapacitacion='+IdAreaCapacitacion);
    }else{
      return EMPTY;
    }
  }


}
