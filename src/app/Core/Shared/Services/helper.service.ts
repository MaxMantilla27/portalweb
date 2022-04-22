import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { BasicUrl } from '../../Models/BasicDTO';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  private msjArray = new ReplaySubject<Array<BasicUrl>>()
  private msjString = new ReplaySubject<string>()

  public get recibirArray() {
    return this.msjArray.asObservable()
  }

  public enviarArray(arreglo: Array<BasicUrl>): void {
    this.msjArray.next(arreglo);
  }
  public get recibirString() {
    return this.msjString.asObservable()
  }

  public enviarAString(texto: string): void {
    this.msjString.next(texto);
  }
}
