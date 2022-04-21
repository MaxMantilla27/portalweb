import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AreacapasitacionService {
  public urlBase=environment.url_api+'AreaCapacitacion';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public GetAreaCapasitacionList():Observable<any>{
    return this.http.get<any>(this.urlBase+'/List');
  }
}
