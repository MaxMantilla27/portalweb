import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroProgramasEnvioDTO } from 'src/app/Core/Models/FiltrosProgramasDTO';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {
  public urlBase=environment.url_api+'Programas';
  constructor(private http: HttpClient) { }

  public GetFiltroProgramas(IdArea?:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/FiltroProgramas?IdArea='+IdArea);
  }
  public GetProgramas(Json:FiltroProgramasEnvioDTO):Observable<any>{

    return this.http.post<any>(this.urlBase+'/PartialProgramas',Json);
  }
}
