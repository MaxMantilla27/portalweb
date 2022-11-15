
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { filter, Subject, takeUntil } from 'rxjs';
import { ChatDetalleIntegraService } from '../Core/Shared/Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { HelperService } from '../Core/Shared/Services/helper.service';
import { SessionStorageService } from '../Core/Shared/Services/session-storage.service';
import { datosAlumnoDTO } from '../Core/Models/AlumnoDTO';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InteraccionService } from '../Core/Shared/Services/Interaccion/interaccion.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { InteraccionFormularioCampoDTO } from '../Core/Models/Interacciones';

@Component({
  selector: 'app-aula-virtual',
  templateUrl: './aula-virtual.component.html',
  styleUrls: ['./aula-virtual.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AulaVirtualComponent implements OnInit ,OnDestroy{
  private signal$ = new Subject();
  isBrowser: boolean;
  @HostListener('document:visibilitychange', ['$event'])
          visibilitychange() {
            this.InteraccionOnVisibility();
          }
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router :Router,
    private _InteraccionService:InteraccionService,
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
      window.onbeforeunload = ()=> {
        if(this.idInteraccionPortalPagina>0){
          this.ActualizarInteraccionPortal()
        }
      };
    }
  }
  ngOnDestroy(): void {
    this.ActualizarInteraccionPortal()
    this.signal$.next(true);
    this.signal$.complete();
    clearInterval(this.interval);
    clearInterval(this.intervalInicio);
  }
  public rutaAnterior:any=null
  public idInteracionPortal=0
  public idInteraccionPortalPagina=0
  public charge=false
  public step=-1;
  public CodigoIso=''
  public OpenChat=false;
  public cargaChat=false;
  public interval:any
  public intervalInicio:any
  public jsonForm:InteraccionFormularioCampoDTO={
    Acciones:[],
    AccionesJson:{},
    IdCategoriaOrigen:null,
    IdConjuntoAnuncio:null,
    IdInteraccionPortalPaginaV2:0,
    IdTipoInteraccionPortalFormulario:0,
    IdInteraccionPortalV2:0,
    Nombre:''
  }
  ngOnInit(): void {
    if(this.isBrowser){
      var datePipe = new DatePipe('en-US');
      this.intervalInicio= setInterval(()=>{
        var usuarioWeb=this._SessionStorageService.SessionGetValue('usuarioWeb');
        if(usuarioWeb!='' && usuarioWeb!=null && usuarioWeb.length>0){
          this.InsertarInteraccionPortalDetalle(null)
          clearInterval(this.intervalInicio);
        }
      },100);
      this.InsertarInteraccionPortalDetalle(null)
      this.InsertarInteraccionPortal(this.rutaAnterior)
      this.rutaAnterior=window.location.href
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd),takeUntil(this.signal$)).subscribe((val) => {
        if(this.idInteraccionPortalPagina>0){
          this.ActualizarInteraccionPortal()
        }
        this.InsertarInteraccionPortalDetalle(null)
        this.InsertarInteraccionPortal(this.rutaAnterior)
        this.rutaAnterior=window.location.href
      });
      this._HelperService.recibirMsjAcciones().pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          if(this.idInteraccionPortalPagina>0){
            var object={
              idInteracionPortal: this.idInteracionPortal,
              idInteraccionPortalPagina: this.idInteraccionPortalPagina,
              fecha:datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss.SSS'),
              acciones: JSON.stringify(x)
            }
            this.InsertarInteraccionPortalDetalle(object)
          }
        }
      })
      this._HelperService.recibirMsjForm().pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          if(this.idInteraccionPortalPagina>0){
            this.jsonForm=x
            this.jsonForm.IdInteraccionPortalV2= this.idInteracionPortal;
            this.jsonForm.IdInteraccionPortalPaginaV2= this.idInteraccionPortalPagina;
            if(this.jsonForm.IdCategoriaOrigen=='')this.jsonForm.IdCategoriaOrigen=0;
            if(this.jsonForm.IdConjuntoAnuncio=='')this.jsonForm.IdConjuntoAnuncio=0;
            this.jsonForm.Acciones=[]
            this.jsonForm.AccionesJson.forEach((js:any) => {
              this.jsonForm.Acciones.push(JSON.stringify(js))
            });
            this.InsertarInteraccionPortalFormulario()
          }
        }
      })
    }

  }
  InteraccionOnVisibility(){
    if(this.isBrowser){
      if (document.hidden) {
        var i = 0;
        this.interval= setInterval(()=>{
          i++;
          if(i==30){
            this.ActualizarInteraccionPortal()

            this.idInteraccionPortalPagina=0
            this.idInteracionPortal=0
            clearInterval(this.interval);
          }
        },1000);
      }else{
        clearInterval(this.interval);
        if(this.idInteraccionPortalPagina==0){
          this.InsertarInteraccionPortal(this.rutaAnterior)
        }
      }
    }
  }
  chatcharge(estado:boolean){
    this.cargaChat=estado
  }
  InsertarInteraccionPortal(urlPrev:any){
    this._InteraccionService.InsertarInteraccionPortal(urlPrev,true).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.idInteraccionPortalPagina=x.idInteraccionPortalPagina
        this.idInteracionPortal=x.idInteracionPortal
      }
    })
  }
  InsertarInteraccionPortalDetalle(accion:any){
    this._InteraccionService.InsertarInteraccionPortalDetalle(accion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }

  InsertarInteraccionPortalFormulario(){
    this._InteraccionService.InsertarInteraccionPortalFormulario(this.jsonForm).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
  ActualizarInteraccionPortal(){
    this._InteraccionService.ActualizarInteraccionPortal(this.idInteraccionPortalPagina).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
}
