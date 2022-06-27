import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  public urlBase=environment.url_api+'LandingPageFormulario';
  constructor(private http: HttpClient) { }
  public ObtenerFormularioLandingPage(IdFormulario:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerFormularioLandingPage?IdFormulario='+IdFormulario);
  }
  public EnviarFormularioLandingPage(Json:ContactenosDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnviarFormularioLandingPage',Json);
  }
}
