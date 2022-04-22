import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  public urlBase=environment.url_api+'Partner';
  constructor(private http: HttpClient) { }

  public GetListPartnerImage():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListPartnerImage');
  }
}
