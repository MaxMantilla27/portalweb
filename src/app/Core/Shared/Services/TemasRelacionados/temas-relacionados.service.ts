import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemasRelacionadosService {

  public urlBase=environment.url_api+'TemasRelacionados';
  constructor(private http: HttpClient) { }
  public TemasRelacionados(ValorTema:number,Nombre:string):Observable<any>{
    return this.http.post<any>(this.urlBase+'/TemasRelacionados?ValorTema='+ValorTema+'&Nombre='+Nombre,{headers:new HttpHeaders});
  }
}
