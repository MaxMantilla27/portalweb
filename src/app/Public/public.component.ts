
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component , HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { HelperService } from '../Core/Shared/Services/helper.service';
import { InteraccionService } from '../Core/Shared/Services/Interaccion/interaccion.service';
declare const fbq:any;

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit ,OnDestroy{
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
    private _HelperService:HelperService
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
  }
  public rutaAnterior:any=null
  public idInteracionPortal=0
  public idInteraccionPortalPagina=0
  public interval:any
  ngOnInit() {
    var datePipe = new DatePipe('en-US');
    if(this.isBrowser){
      fbq('track', 'PageView');

      this.InsertarInteraccionPortalDetalle(null)
      this.InsertarInteraccionPortal(this.rutaAnterior)
      this.rutaAnterior=window.location.href
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd),takeUntil(this.signal$)).subscribe((val) => {
        // see also
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
  InsertarInteraccionPortal(urlPrev:any){
    this._InteraccionService.InsertarInteraccionPortal(urlPrev,false).pipe(takeUntil(this.signal$)).subscribe({
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
  ActualizarInteraccionPortal(){
    this._InteraccionService.ActualizarInteraccionPortal(this.idInteraccionPortalPagina).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
}
