import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { tap } from 'rxjs';
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
export class AppComponent implements OnInit,AfterViewInit  {
  title = 'PortalWeb';
  isBrowser: boolean;
  public charge=false
  public step=-1;
  constructor(
    private _HelperService: HelperService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private _GlobalService:GlobalService,
    private _SessionStorageService: SessionStorageService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public Expandibles:Array<BasicBotonesExpandibles> = [
    {
      Nombre: 'Formación Continua',
      data: [],
      estatus: true,
    },
    {
      Nombre: 'Carreras Profesionales',
      data: [],
      estatus: false,
    },
    {
      Nombre: 'Educación Técnica',
      data: [],
      estatus: false,
    },
  ];
  ngOnInit() {
    var usuarioWeb=this._SessionStorageService.SessionGetValue('usuarioWeb');
    if(usuarioWeb==''){
      this.RegistroInteraccionInicial();
    }else{
      this.charge=true;
    }
  }
  RegistroInteraccionInicial(){
    this._GlobalService.RegistroInteraccionInicial().subscribe({
      next:x=>{
      console.log(x);
      this._SessionStorageService.SessionSetValue('usuarioWeb',x.identificadorUsuario);
      this._SessionStorageService.SessionSetValue('ISO_PAIS',x.codigoISO);
      this.charge=true;
    }})
  }
  ngAfterViewInit() {
    this.router.events.subscribe((val) => {
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
    console.log(e)
    this.Expandibles=e
  }
}
