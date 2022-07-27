import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutoEvaluacionService {
  public urlBase=environment.url_api+'AutoEvaluacion';
  constructor(private http: HttpClient) { }

  public GenerarReporteFiltradoPortal(IdProveedorOperaciones:string,IdCentroCosto?:string):Observable<any>{
    if(IdCentroCosto==undefined)IdCentroCosto='';
    return this.http.get<any>(this.urlBase+'/GenerarReporteFiltradoPortal?IdProveedorOperaciones='+IdProveedorOperaciones+ "&IdCentroCosto=" +IdCentroCosto);
  }

  public ObtenerAutoEvaluacionPrograma(IdPGeneral:number,IdPEspecifico:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerAutoEvaluacionPrograma?IdPGeneral='+IdPGeneral+ "&IdPEspecifico=" +IdPEspecifico);
  }
}
