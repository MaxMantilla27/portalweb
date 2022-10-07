import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ObtenerTopProgramasSendDTO } from 'src/app/Core/Models/HomeDTO';
import { ProgramasGeneralDTO } from 'src/app/Core/Models/ProgramasGeneralesDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Home';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public GetProgramasHome(Json:ObtenerTopProgramasSendDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ObtenerTopProgramas',Json);
    }else{
      return EMPTY;
    }
  }
}
