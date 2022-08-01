import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteParticipacionExpositorService {
  isBrowser: boolean;
  public urlBase=environment.url_api_integra+'ReporteParticipacionExpositor';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GenerarReporteFiltradoPortal(Json:ParticipacionExpositorFiltroDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/GenerarReporteFiltradoPortal',Json);
    }else{
      return EMPTY;
    }
  }
}
