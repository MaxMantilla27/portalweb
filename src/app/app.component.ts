import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { BasicBotonesExpandibles } from './Core/Models/BasicDTO';
import { GlobalService } from './Core/Shared/Services/Global/global.service';
import { HelperService } from './Core/Shared/Services/helper.service';
import { SessionStorageService } from './Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit,AfterViewInit ,OnDestroy {
  private signal$ = new Subject();
  title = 'PortalWeb';
  isBrowser: boolean;
  public charge=false
  public step=-1;
  public CodigoIso=''
  public OpenChat=false;
  public cargaChat=false;
  public usuarioWeb=''
  public esChatbot = false;

  constructor(
    private _HelperService: HelperService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private _GlobalService:GlobalService,
    private _SessionStorageService: SessionStorageService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public Expandibles:Array<BasicBotonesExpandibles> = [
    {
      Nombre: 'Formación Continua',
      data: [],
      estatus: true,
    },
    // {
    //   Nombre: 'Carreras Profesionales',
    //   data: [],
    //   estatus: false,
    // },
    {
      Nombre: 'Educación Técnica',
      data: [],
      estatus: false,
    },
  ];
  public IdPGeneral=0;
  public stateToekn=false;
  ngOnInit() {
    console.log("Inicio Ruta ",window.frames.location);

    this.esChatbot = window.frames.location.href == 'http://localhost:4200/Chat/1' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/1' || window.frames.location.href == 'https://bsginstitute.com/Chat/1'? true: false;
    if(window.frames.location.href == 'http://localhost:4200/Chat/1' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/1' || window.frames.location.href == 'https://bsginstitute.com/Chat/1'||
    window.frames.location.href == 'http://localhost:4200/Chat/2' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/2' || window.frames.location.href == 'https://bsginstitute.com/Chat/2'||
    window.frames.location.href == 'http://localhost:4200/Chat/3' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/3' || window.frames.location.href == 'https://bsginstitute.com/Chat/3'||
    window.frames.location.href == 'http://localhost:4200/Chat/4' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/4' || window.frames.location.href == 'https://bsginstitute.com/Chat/4'||
    window.frames.location.href == 'http://localhost:4200/Chat/5' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/5' || window.frames.location.href == 'https://bsginstitute.com/Chat/5'||
    window.frames.location.href == 'http://localhost:4200/Chat/6' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/6' || window.frames.location.href == 'https://bsginstitute.com/Chat/6'||
    window.frames.location.href == 'http://localhost:4200/Chat/7' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/7' || window.frames.location.href == 'https://bsginstitute.com/Chat/7'||
    window.frames.location.href == 'http://localhost:4200/Chat/8' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/8' || window.frames.location.href == 'https://bsginstitute.com/Chat/8'||
    window.frames.location.href == 'http://localhost:4200/Chat/9' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/9' || window.frames.location.href == 'https://bsginstitute.com/Chat/9'||
    window.frames.location.href == 'http://localhost:4200/Chat/10' || window.frames.location.href == 'https://img.bsgrupo.com/Chat/10' || window.frames.location.href == 'https://bsginstitute.com/Chat/10'){
      this.esChatbot = true
    }
    else{
      this.esChatbot = false
    }

    this.router.events.pipe(takeUntil(this.signal$)).subscribe((val) => {
      this.IdPGeneral=0;
      this.stateToekn=this._SessionStorageService.validateTokken();
    });
    this.usuarioWeb=this._SessionStorageService.SessionGetValue('usuarioWeb');
    console.log(this.usuarioWeb)
    var codIso=this._SessionStorageService.SessionGetValue('ISO_PAIS');
    if(this.usuarioWeb=='' || codIso==''){
      if(codIso==''){
        this.ObtenerCodigoIso()
      }
      if(this.usuarioWeb==''){
        this.RegistroInteraccionInicial();
      }else{
        this._HelperService.enviarmsjObtenerUsuario(this.usuarioWeb);
      }
    }else{
      this.CodigoIso=codIso;
      this.charge=true;
      this._HelperService.enviarmsjObtenerUsuario(this.usuarioWeb);
    }
  }
  ObtenerCodigoIso(){
    this._GlobalService.ObtenerCodigoIso().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      this._SessionStorageService.SessionSetValue('ISO_PAIS',x.codigoISO);
      this.CodigoIso=x.codigoISO;
      this.charge=true;
    }})
  }
  RegistroInteraccionInicial(){
    this._GlobalService.RegistroInteraccionInicial().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      this._SessionStorageService.SessionSetValue('usuarioWeb',x.identificadorUsuario);
      this.usuarioWeb=x.identificadorUsuario
      this.charge=true;
      this._HelperService.enviarmsjObtenerUsuario(x.identificadorUsuario);
      this.InsertarContactoPortal();
    }})
  }
  InsertarContactoPortal(){
    this._GlobalService.InsertarContactoPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    });
  }
  ngAfterViewInit() {
    this.router.events.pipe(takeUntil(this.signal$)).subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(this.isBrowser){
          document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
        }
      }
    });
  }
  onSideNavScroll(event: any) {
    this._HelperService.enviarScroll(event.target.scrollTop);
  }
  changeExpandibles(e:any){
    this.Expandibles=e
  }
}
