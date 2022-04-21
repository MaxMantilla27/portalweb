import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderPermissionsService {
  public Carreras=[
    'PE','CO','INTC'
  ]
  public CarrerasTecnicas=[
    'PE'
  ]
  constructor() { }
  ValidateCarreras(Iso:string): boolean {
    if(this.Carreras.indexOf(Iso) !== -1){
      return true;
    }
    return false;
  }
  ValidateCarrerasTecnicas(Iso:string): boolean {
    if(this.CarrerasTecnicas.indexOf(Iso) !== -1){
      return true;
    }
    return false;
  }
}
