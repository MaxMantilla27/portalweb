import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { BasicUrl } from '../../Models/BasicDTO';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  private msjArrayCarrera = new ReplaySubject<Array<BasicUrl>>()
  private msjArrayFormacion = new ReplaySubject<Array<BasicUrl>>()
  private msjStringCarrera = new ReplaySubject<string>()
  private msjScroll = new ReplaySubject<number>()

  public get recibirArrayCarrera() {
    return this.msjArrayCarrera.asObservable()
  }

  public enviarArrayCarrera(arreglo: Array<BasicUrl>): void {
    this.msjArrayCarrera.next(arreglo);
  }
  public get recibirStringCarrera() {
    return this.msjStringCarrera.asObservable()
  }
  public enviarStringCarrera(texto: string): void {
    this.msjStringCarrera.next(texto);
  }
  public get recibirArrayFormacion() {
    return this.msjArrayFormacion.asObservable()
  }

  public enviarArrayFormacion(arreglo: Array<BasicUrl>): void {
    this.msjArrayFormacion.next(arreglo);
  }
  public get recibirScroll(){
    return this.msjScroll.asObservable();
  }
  public enviarScroll(scroll: number): void {
    this.msjScroll.next(scroll);
  }
}
