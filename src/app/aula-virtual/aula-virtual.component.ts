
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { filter, Subject, takeUntil } from 'rxjs';
import { ChatDetalleIntegraService } from '../Core/Shared/Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { HelperService } from '../Core/Shared/Services/helper.service';
import { SessionStorageService } from '../Core/Shared/Services/session-storage.service';
import { datosAlumnoDTO } from '../Core/Models/AlumnoDTO';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InteraccionService } from '../Core/Shared/Services/Interaccion/interaccion.service';
import { isPlatformBrowser } from '@angular/common';

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
    private activatedRoute: ActivatedRoute,
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
    console.log('aula destroy')
    clearInterval(this.interval);
    this.ActualizarInteraccionPortal()
    this.signal$.next(true);
    this.signal$.complete();
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
  ngOnInit(): void {
    if(this.isBrowser){
      //this.InsertarInteraccionPortalDetalle(null)
      this.InsertarInteraccionPortal(this.rutaAnterior)
      this.rutaAnterior=window.location.href
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd),takeUntil(this.signal$)).subscribe((val) => {
        // see also
          console.log(val)
          if(this.idInteraccionPortalPagina>0){
            this.ActualizarInteraccionPortal()
          }
          this.InsertarInteraccionPortal(this.rutaAnterior)
          this.rutaAnterior=window.location.href
      });
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
        console.log(x)
        this.idInteraccionPortalPagina=x.idInteraccionPortalPagina
        this.idInteracionPortal=x.idInteracionPortal
      }
    })
  }
  InsertarInteraccionPortalDetalle(accion:any){
    this._InteraccionService.InsertarInteraccionPortalDetalle(accion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
      }
    })
  }
  ActualizarInteraccionPortal(){
    console.log(this.idInteraccionPortalPagina)
    this._InteraccionService.ActualizarInteraccionPortal(this.idInteraccionPortalPagina).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
}
