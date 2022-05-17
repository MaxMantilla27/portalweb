import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public urlBase=environment.url_api+'Helper';
  constructor(private http: HttpClient) { }

  public EnviarFormulario(Json:ContactenosDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnviarFormulario',Json);
  }
}
