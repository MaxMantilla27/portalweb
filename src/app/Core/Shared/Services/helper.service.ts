import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { combosPerfilDTO } from '../../Models/AlumnoDTO';
import { AvatarCombosDTO } from '../../Models/Avatar';
import { BasicUrl } from '../../Models/BasicDTO';
import { SetChat } from '../../Models/ChatEnLineaDTO';
import { DatoObservableDTO } from '../../Models/DatoObservableDTO';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  private msjConbosPerfil = new ReplaySubject<combosPerfilDTO>()
  private msjArrayCarrera = new ReplaySubject<Array<BasicUrl>>()
  private msjStringCarrera = new ReplaySubject<string>()
  private msjArrayFormacion = new ReplaySubject<Array<BasicUrl>>()
  private msjScroll = new ReplaySubject<number>()
  private msjScrollFooter = new ReplaySubject<string>()
  private msjCombosAvatar = new ReplaySubject<AvatarCombosDTO>()
  private msjRecarga = new ReplaySubject<DatoObservableDTO>()
  private msjPaises = new ReplaySubject<Array<any>>()
  //private msjChangePais = new ReplaySubject<any>()
  private msjChangePais=new Subject<any>();
  private msjArrayEducacion = new ReplaySubject<Array<BasicUrl>>(1)
  private msjStringEducacion = new ReplaySubject<string>(1)
  private msjAcciones=new Subject<any>();
  private msjAccionesForm=new Subject<any>();
  private msjChat=new Subject<SetChat>();
  private ActivarTipoExamen=new Subject<number>();


  enviarActivarTipoExamen(data:number):void {
    this.ActivarTipoExamen.next(data);
  }
  recibirActivarTipoExamen(): Observable<any> {
    return this.ActivarTipoExamen.asObservable();
  }

  enviarMsjChat(data:SetChat):void {
    this.msjChat.next(data);
  }
  recibirMsjChat(): Observable<any> {
    return this.msjChat.asObservable();
  }
  enviarMsjForm(data:any):void {
    this.msjAccionesForm.next(data);
  }
  recibirMsjForm(): Observable<any> {
    return this.msjAccionesForm.asObservable();
  }
  enviarMsjAcciones(data:any):void {
    this.msjAcciones.next(data);
  }
  recibirMsjAcciones(): Observable<any> {
    return this.msjAcciones.asObservable();
  }

  enviarChangePais(data:any):void {
    this.msjChangePais.next(data);
  }
  recibirChangePais(): Observable<any> {
    return this.msjChangePais.asObservable();
  }
  // public get recibirChangePais() {
  //   return this.msjChangePais.asObservable()
  // }
  // public enviarChangePais(datos: any): void {
  //   this.msjChangePais.next(datos);
  // }
  public get recibirDataPais() {
    return this.msjPaises.asObservable()
  }
  public enviarDataPais(datos: Array<any>): void {
    this.msjPaises.next(datos);
  }
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
  public get recibirArrayEducacion() {
    return this.msjArrayEducacion.asObservable()
  }
  public enviarArrayEducacion(arreglo: Array<BasicUrl>): void {
    this.msjArrayEducacion.next(arreglo);
  }
  public get recibirStringEducacion() {
    return this.msjStringEducacion.asObservable()
  }
  public enviarStringEducacion(texto: string): void {
    this.msjStringEducacion.next(texto);
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

}
