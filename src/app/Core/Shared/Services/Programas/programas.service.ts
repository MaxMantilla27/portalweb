import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { FiltroProgramasEnvioDTO } from 'src/app/Core/Models/FiltrosProgramasDTO';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Programas';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GetFiltroProgramas(IdArea?:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/FiltroProgramas?IdArea='+IdArea);
    }else{
      return EMPTY;
    }
  }
  public GetProgramas(Json:FiltroProgramasEnvioDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/PartialProgramas',Json);
    }else{
      return EMPTY;
    }
  }
}
