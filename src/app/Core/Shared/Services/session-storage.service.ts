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
    return null;
  }
  SetToken(token: string):void{
    if(this.isBrowser){
      localStorage.setItem('Token',btoa(token));
    }
  }

  SessionSetValue(name:string, token: string):void{
    if(this.isBrowser){
      localStorage.setItem(name,btoa(token));
    }
  }
  SessionGetValue(name:string):string{
    if(this.isBrowser){

      var value=localStorage.getItem(name);
      if(value==undefined || value==null) return '';
      return atob(value);
    }
    if(name.toUpperCase()=='ISO_PAIS')return 'INTC';
    return '';
  }
  SessionDeleteValue(name:string):void{
    if(this.isBrowser){
      localStorage.removeItem(name)
    }
  }
  SetEstructura(datos:Array<any>):void{

    if(this.isBrowser){
      sessionStorage.setItem('Estructura',btoa(encodeURIComponent(JSON.stringify(datos))));
    }
  }
  DeleteEstructura():void{

    if(this.isBrowser){
      sessionStorage.removeItem('Estructura');
    }
  }
  getEstructura():any{

    if(this.isBrowser){
      var token=sessionStorage.getItem('Estructura');
      if(token==undefined || token==null) return null;
      return JSON.parse(decodeURIComponent(atob(token)));
    }
    return null;
  }
  DeleteToken():void{
    if(this.isBrowser){
      localStorage.removeItem('Token');
    }
  }

  SessionSetValueSesionStorage(name:string, token: string):void{
    if(this.isBrowser){
      sessionStorage.setItem(name,btoa(token));
    }
  }
  SessionGetValueSesionStorage(name:string):string{
    if(this.isBrowser){

      var value=sessionStorage.getItem(name);
      if(value==undefined || value==null) return '';
      return atob(value);
    }
    if(name.toUpperCase()=='ISO_PAIS')return 'INTC';
    return '';
  }
  SessionSetValueCokies(name:string, token: string,hour:number):void{
    if(this.isBrowser){
      let d: Date = new Date();
      console.log(d);
      d.setTime(
        d.getTime() + hour * 1000 * 3600
      );
      document.cookie =
      (name) +
      '=' +
      (btoa(token)) +
      ';' +
      ('expires=' + d.toUTCString() + ';')

    }
  }
  SessionGetValueCokies(name:string):string{
    if(this.isBrowser){
      let ca: Array<string> = document.cookie.split(';');
      let caLen: number = ca.length;
      let cookieName = `${name}=`;
      let c: string;

      for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) == 0) {
          return atob(c.substring(cookieName.length, c.length));
        }
      }
      return '';
    }
    return '';
  }
}
