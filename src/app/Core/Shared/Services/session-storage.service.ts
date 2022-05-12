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
      var token=localStorage.getItem('Token');
      return (token==undefined || token==null)?false:true;
    }else{
      return false;
    }
  }
  GetToken():string|null{
    if(this.isBrowser){
      var token=localStorage.getItem('Token');
      if(token==undefined || token==null) return null;
      return atob(token)
    }
    return 'INTC';
  }
  SetToken(token: string):void{
    if(this.isBrowser){
      localStorage.setItem('Token',btoa(token));
    }
  }
  DeleteToken():void{
    if(this.isBrowser){
      localStorage.removeItem('Token');
    }
  }

  SessionSetValue(name:string, token: string):void{
    if(this.isBrowser){
      localStorage.setItem(name,token);
    }
  }
  SessionGetValue(name:string):string{
    if(this.isBrowser){

      var value=localStorage.getItem(name);
      if(value==undefined || value==null) return '';
      return value;
    }
    return 'INTC'
  }
  SessionDeleteValue(name:string):void{
    if(this.isBrowser){
      localStorage.removeItem(name)
    }
  }

}
