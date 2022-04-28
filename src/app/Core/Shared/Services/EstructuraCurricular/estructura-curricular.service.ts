import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EstructuraCurricularService {
  public urlBase=environment.url_api+'Programa';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public GetEstructuraCarreraTecnicaPortal(IdBusqueda:number):Observable<any>{
    let params = new HttpParams();
    params=params.append("IdBusqueda", IdBusqueda.toString());
    return this.http.get<any>(this.urlBase+'/EstructuraCarreraTecnicaPortal',{ headers:new HttpHeaders(), params: params });
  }
}
