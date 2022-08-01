import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutoEvaluacionService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'AutoEvaluacion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GenerarReporteFiltradoPortal(IdProveedorOperaciones:string,IdCentroCosto?:string):Observable<any>{
    if(this.isBrowser){
      if(IdCentroCosto==undefined)IdCentroCosto='';
      return this.http.get<any>(this.urlBase+'/GenerarReporteFiltradoPortal?IdProveedorOperaciones='+IdProveedorOperaciones+ "&IdCentroCosto=" +IdCentroCosto);
    }else{
      return EMPTY;
    }
  }

  public ObtenerAutoEvaluacionPrograma(IdPGeneral:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAutoEvaluacionPrograma?IdPGeneral='+IdPGeneral+ "&IdPEspecifico=" +IdPEspecifico);
    }else{
      return EMPTY;
    }
  }
}
