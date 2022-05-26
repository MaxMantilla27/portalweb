import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialAdicionalService {
  public urlBase=environment.url_api+'MaterialAdicional';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public MaterialAdicionalAonline(idPGeneral:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/MaterialAdicionalAonline?IdPGeneral='+idPGeneral);
  }
  public MaterialAdicionalOnline(idPGeneral:number,idPEspecifico:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/MaterialAdicionalOnline?IdPGeneral='+idPGeneral+'&IdPEspecifico='+idPEspecifico);
  }
}
