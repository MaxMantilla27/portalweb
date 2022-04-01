import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }
  validateTokken(): boolean {
    var token=sessionStorage.getItem('Token');
    return (token==undefined || token==null)?false:true;
  }
  GetToken():string|null{
    var token=sessionStorage.getItem('Token');
    if(token==undefined || token==null) return null;
    return atob(token)
  }
  SetToken(token: string):void{
    sessionStorage.setItem('Token',btoa(token));
  }


}
