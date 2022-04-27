import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObtenerTopProgramasSendDTO } from 'src/app/Core/Models/HomeDTO';
import { ProgramasGeneralDTO } from 'src/app/Core/Models/ProgramasGeneralesDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public urlBase=environment.url_api+'Home';
  constructor(private http: HttpClient) { }

  public GetProgramasHome(Json:ObtenerTopProgramasSendDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/ObtenerTopProgramas',Json);
  }
}
