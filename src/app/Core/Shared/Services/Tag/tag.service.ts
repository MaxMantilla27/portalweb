import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  public urlBase=environment.url_api+'Tag';
  constructor(private http: HttpClient) { }
  public ListTagProgramaRelacionadoPorIdBusqueda(IdBusqueda:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListTagProgramaRelacionadoPorIdBusqueda?IdBusqueda='+IdBusqueda);
  }
  public ListTagArticuloRelacionadoPorIdWeb(IdWeb:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListTagArticuloRelacionadoPorIdWeb?IdWeb='+IdWeb);
  }

}
