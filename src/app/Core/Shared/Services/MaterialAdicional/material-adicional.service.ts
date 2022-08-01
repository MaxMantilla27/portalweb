import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialAdicionalService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'MaterialAdicional';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public MaterialAdicionalAonline(idPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/MaterialAdicionalAonline?IdPGeneral='+idPGeneral);
    }else{
      return EMPTY;
    }
  }
  public MaterialAdicionalOnline(idPGeneral:number,idPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/MaterialAdicionalOnline?IdPGeneral='+idPGeneral+'&IdPEspecifico='+idPEspecifico);
    }else{
      return EMPTY;
    }
  }
}
