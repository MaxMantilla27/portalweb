import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Articulo';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ListArticuloHome(IdTipoArticulo:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListArticuloHome?IdTipoArticulo='+IdTipoArticulo);
    }else{
      return EMPTY;
    }
  }
  public ObtenerArticuloDetalleHome(IdTipoArticulo:number,IdWeb:number,UrlWeb:string):Observable<any>{
    //este es meta
    return this.http.get<any>(this.urlBase+'/ObtenerArticuloDetalleHome?IdTipoArticulo='+IdTipoArticulo+'&IdWeb='+IdWeb+'&UrlWeb='+UrlWeb);
  }
  public EnviarFormulario(Json:ContactenosDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EnviarFormulario',Json);
    }else{
      return EMPTY;
    }
  }
}
