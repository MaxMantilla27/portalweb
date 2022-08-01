import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';
import { EMPTY} from "rxjs";
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AreacapasitacionService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'AreaCapacitacion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GetAreaCapasitacionList():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/List');
    }else{
      return EMPTY;
    }
  }
}
