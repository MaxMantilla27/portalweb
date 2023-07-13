import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BasicCarousel, BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { PartnerService } from 'src/app/Core/Shared/Services/Partner/partner.service';
import { isPlatformBrowser } from '@angular/common';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import {Title} from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionBoliviaComponent } from './notificacion-bolivia/notificacion-bolivia.component';
declare const fbq:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();
  isBrowser: boolean;

  public busqueda=''
  public inputActive=false

  constructor(

    private _HelperService :HelperService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService,
     @Inject(PLATFORM_ID) platformId: Object,
     private _SeoService:SeoService,
    private title:Title,
    public dialog: MatDialog,
  ) {

    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public innerWidth: any;
  public seccionStep=4;
  public IsoPais=''
  ngOnInit(): void {
    this.IsoPais = this._SessionStorageService.SessionGetValue('ISO_PAIS');
    if(this.IsoPais=='BO'){
      this.OpenNotificacionBolivia()
    }
    this._SessionStorageService.SessionSetValueCokies('prueba','123',1)
    let t:string='BSG Institute'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      image:'https://img.bsginstitute.com/repositorioweb/img/capacitacion-bsgrupo.png'
    });
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
    this._HelperService.recibirChangePais().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        if(this.IsoPais.toUpperCase()!='BO'){
          if(x=='BO'){
            this.OpenNotificacionBolivia()
          }
        }
        this.IsoPais=x
      }
    })
  }
  BuscarProgramas(esButton:boolean){
    var obj:any
    if(esButton){
      obj={Tag:"Button",Nombre:"Busqueda",valor:this.busqueda}
    }else{
      obj={Tag:'Input',Accion:'keyup.enter',Tipo:'text',Nombre:'Busqueda',valor:this.busqueda}
    }
    this._HelperService.enviarMsjAcciones(obj)

    this._SessionStorageService.SessionSetValue('BusquedaPrograma',this.busqueda);
    this._router.navigate(['/programas-certificaciones-cursos']);
  }
  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Input',Accion:'click',Tipo:'text',Nombre:'¿Qué te gustaría aprender?',valor:this.busqueda})
  }
  OpenNotificacionBolivia(){
    const dialogRef = this.dialog.open(NotificacionBoliviaComponent, {
      width: '1000px',
      panelClass: 'custom-class-notificacion-Bolivia',
    });
  }
}

