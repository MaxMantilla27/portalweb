import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
   }
   validateTokken(): boolean {
    if(this.isBrowser){
      var token=sessionStorage.getItem('Token');
      return (token==undefined || token==null)?false:true;
    }else{
      return false;
    }
  }
  GetToken():string|null{
    if(this.isBrowser){
      var token=sessionStorage.getItem('Token');
      if(token==undefined || token==null) return null;
      return atob(token)
    }
    return 'INTC';
  }
  SetToken(token: string):void{
    if(this.isBrowser){
      sessionStorage.setItem('Token',btoa(token));
    }
  }

  SessionSetValue(name:string, token: string):void{
    if(this.isBrowser){
      sessionStorage.setItem(name,token);
    }
  }
  SessionGetValue(name:string):string{
    if(this.isBrowser){

      var value=sessionStorage.getItem(name);
      if(value==undefined || value==null) return '';
      return value;
    }
    return 'INTC'
  }

}
