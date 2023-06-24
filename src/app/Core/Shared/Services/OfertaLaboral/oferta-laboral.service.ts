import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Route, Router } from '@angular/router';
import { EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';
@Injectable({
  providedIn: 'root'
})
export class OfertaLaboralService {
  isBrowser: boolean;
  private signal$ = new Subject();
  public urlBase=environment.url_api+'ConvocatoriaPersonal';
  constructor(
    private http: HttpClient,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerConvocatoriasVigentes():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerConvocatoriasVigentes');
    }else{
      return EMPTY;
    }
  }
  public ObtenerPostulacionesAlumno():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerPostulacionesAlumno');
    }else{
      return EMPTY;
    }
  }

  public RegistrarPostulacionAlumno(idConvocatoria:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistrarPostulacionAlumno/'+idConvocatoria);
    }else{
      return EMPTY;
    }
  }
  public ValidarPostulacion(idConvocatoria:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarPostulacion/'+idConvocatoria);
    }else{
      return EMPTY;
    }
  }
}
