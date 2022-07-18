import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteParticipacionExpositorService {

  public urlBase=environment.url_api_integra+'ReporteParticipacionExpositor';
  constructor(private http: HttpClient) { }

  public GenerarReporteFiltradoPortal(Json:ParticipacionExpositorFiltroDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/GenerarReporteFiltradoPortal',Json);
  }
}
