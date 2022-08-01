import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { PEspecificoSilaboRegistrarDTO } from 'src/app/Core/Models/EvaluacionRegistrarDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesPEspecificoService {
  isBrowser: boolean;
  public urlBase=environment.url_api_integra+'Operaciones/PEspecificoSilabo';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public PorPrograma(idPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/PorPrograma/'+idPEspecifico);
    }else{
      return EMPTY;
    }
  }
  public Aprobar(Json:PEspecificoSilaboRegistrarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/Aprobar',Json);
    }else{
      return EMPTY;
    }
  }
}
