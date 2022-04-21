import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarreraProfecionalService {
  public urlBase=environment.url_api+'CarreraProfesionalTecnica';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public GetCarreras(IdCategoria:number):Observable<any>{
    let params = new HttpParams();
    params=params.append("IdCategoria", IdCategoria.toString());
    return this.http.get<any>(this.urlBase+'/ListProfesionCabecera',{ headers:new HttpHeaders(), params: params });
  }
}
