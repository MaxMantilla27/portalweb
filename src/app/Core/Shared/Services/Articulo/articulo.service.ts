import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  public urlBase=environment.url_api+'Articulo';
  constructor(private http: HttpClient) { }
  public ListArticuloHome(IdTipoArticulo:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListArticuloHome?IdTipoArticulo='+IdTipoArticulo);
  }
  public ObtenerArticuloDetalleHome(IdTipoArticulo:number,IdWeb:number,UrlWeb:string):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerArticuloDetalleHome?IdTipoArticulo='+IdTipoArticulo+'&IdWeb='+IdWeb+'&UrlWeb='+UrlWeb);
  }
  public EnviarFormulario(Json:ContactenosDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnviarFormulario',Json);
  }
}
