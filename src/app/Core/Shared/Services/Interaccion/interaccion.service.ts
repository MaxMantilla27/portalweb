
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe, isPlatformBrowser, Location } from '@angular/common';
import { SessionStorageService } from '../session-storage.service';
import { InteraccionFormularioCampoDTO } from 'src/app/Core/Models/Interacciones';

@Injectable({
  providedIn: 'root'
})
export class InteraccionService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Interaccion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private _SessionStorageService:SessionStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public InsertarInteraccionPortal(urlPrev:any,tipo:boolean):Observable<any>{
    // return EMPTY;
    if(this.isBrowser){
      var urls={
        UrlAnterior:urlPrev==null?document.referrer:urlPrev,
        UrlActual:window.location.href,
        EsAulaVirtual:tipo
      }
      return this.http.post<any>(this.urlBase+'/InsertarInteraccionPortal',urls);
    }else{
      return EMPTY;
    }
  }
  public ActualizarInteraccionPortal(Id:number):Observable<any>{
    // return EMPTY;
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ActualizarInteraccionPortal?Id='+Id);
    }else{
      return EMPTY;
    }
  }
  public InsertarInteraccionPortalDetalle(accion:any):Observable<any>{
    // return EMPTY;
    if(this.isBrowser){
      var json=this._SessionStorageService.SessionGetValue("Acciones");
      if(accion==null){
        if(json!=''){
          try {
            var js=JSON.parse(json)
            console.log(js)
            this._SessionStorageService.SessionDeleteValue("Acciones");
            return this.http.post<any>(this.urlBase+'/InsertarInteraccionPortalDetalle',js);
          } catch (error) {
            console.log("----error----")
          }
        }
        return EMPTY;
      }else{
        var jsonLocal:Array<any>=[]
        if(json!=''){
          jsonLocal=JSON.parse(json);
        }
        jsonLocal.push(accion)
        console.log(jsonLocal)
        if(jsonLocal.length>=50){
          this._SessionStorageService.SessionDeleteValue("Acciones");
          return this.http.post<any>(this.urlBase+'/InsertarInteraccionPortalDetalle',jsonLocal);
        }else{
          this._SessionStorageService.SessionSetValue("Acciones",JSON.stringify(jsonLocal))
          return EMPTY;
        }
      }
    }else{
      return EMPTY;
    }
  }
  public InsertarInteraccionPortalFormulario(json:InteraccionFormularioCampoDTO):Observable<any>{
    // return EMPTY;
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/InsertarInteraccionPortalFormulario',json);
    }else{
      return EMPTY;
    }
  }
}
