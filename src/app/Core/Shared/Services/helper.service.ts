import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { combosPerfilDTO } from '../../Models/AlumnoDTO';
import { AvatarCombosDTO } from '../../Models/Avatar';
import { BasicUrl } from '../../Models/BasicDTO';
import { DatoObservableDTO } from '../../Models/DatoObservableDTO';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  private msjConbosPerfil = new ReplaySubject<combosPerfilDTO>()
  private msjArrayCarrera = new ReplaySubject<Array<BasicUrl>>()
  private msjArrayFormacion = new ReplaySubject<Array<BasicUrl>>()
  private msjStringCarrera = new ReplaySubject<string>()
  private msjScroll = new ReplaySubject<number>()
  private msjScrollFooter = new ReplaySubject<string>()
  private msjCombosAvatar = new ReplaySubject<AvatarCombosDTO>()
  private msjRecarga = new ReplaySubject<DatoObservableDTO>()
  private msjPaises = new ReplaySubject<Array<any>>()

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
  public get recibirScrollFooter() {
    return this.msjScrollFooter.asObservable()
  }
  public enviarScrollFooter(texto: string): void {
    this.msjScrollFooter.next(texto);
  }

  public get recibirCombosPerfil() {
    return this.msjConbosPerfil.asObservable()
  }
  public enviarCombosPerfi(combosPerfil: combosPerfilDTO): void {
    this.msjConbosPerfil.next(combosPerfil);
  }
  public get recibirDatosAvatar() {
    return this.msjCombosAvatar.asObservable()
  }
  public enviarDatosAvatar(combosAvatar: AvatarCombosDTO): void {
    this.msjCombosAvatar.next(combosAvatar);
  }
  public get recibirDatoCuenta() {
    return this.msjRecarga.asObservable()
  }
  public enviarDatoCuenta(datos: DatoObservableDTO): void {
    this.msjRecarga.next(datos);
  }
  public get recibirDataPais() {
    return this.msjPaises.asObservable()
  }
  public enviarDataPais(datos: Array<any>): void {
    this.msjPaises.next(datos);
  }
}
