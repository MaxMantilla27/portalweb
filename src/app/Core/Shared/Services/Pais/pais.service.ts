import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaisDTO } from 'src/app/Core/Models/PaisDTO';
import {environment} from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PaisService {
  public urlBase=environment.url_api+'Pais';
  constructor(private http: HttpClient) { }

  public GetPaises():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListCabecera');
  }
}
