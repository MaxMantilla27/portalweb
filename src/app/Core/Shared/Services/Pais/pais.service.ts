import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { PaisDTO } from 'src/app/Core/Models/PaisDTO';
import {environment} from '../../../../../environments/environment';
import { EMPTY} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Pais';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public GetPaises():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListCabecera');
    }else{
      return EMPTY;
    }
  }
}
