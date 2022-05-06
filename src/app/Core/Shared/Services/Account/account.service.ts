import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterDTO } from 'src/app/Core/Models/AlumnoDTO';
import { FiltroProgramasEnvioDTO } from 'src/app/Core/Models/FiltrosProgramasDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public urlBase=environment.url_api+'Account';
  constructor(private http: HttpClient) { }

  public RegistrarseAlumno(Json:RegisterDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/RegistrarseAlumno',Json);
  }
}
