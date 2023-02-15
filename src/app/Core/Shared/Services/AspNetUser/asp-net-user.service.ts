import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroProgramasEnvioDTO } from 'src/app/Core/Models/FiltrosProgramasDTO';
import { loginSendDTO, loginSendFacebookDTO } from 'src/app/Core/Models/login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AspNetUserService {
  public urlBase=environment.url_api+'AspNetUser';
  constructor(private http: HttpClient) { }

  public Authenticate(Json:loginSendDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/Authenticate',Json);
  }
  public AuthenticateFacebook(Json:loginSendFacebookDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/AuthenticateFacebook',Json);
  }

}
