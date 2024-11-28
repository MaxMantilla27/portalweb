import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { BasicBotonesExpandibles } from './Core/Models/BasicDTO';
import { GlobalService } from './Core/Shared/Services/Global/global.service';
import { HelperService } from './Core/Shared/Services/helper.service';
import { SessionStorageService } from './Core/Shared/Services/session-storage.service';
import { FormularioProgressiveProfilingService } from './Core/Shared/Services/FormularioProgressiveProfiling/formulario-progressive-profiling.service';
import { RegistroVisitaPortalService } from './Core/Shared/Services/RegistroVisitaPortal/registro-visita-portal.service';
import { MatDialog } from '@angular/material/dialog';
import { FormularioProgressiveProfilingComponent } from './Public/formulario-progressive-profiling/formulario-progressive-profiling.component';

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
  intervaloTiempoFormularioProgresivo: any;

  constructor(
    private _HelperService: HelperService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private _GlobalService:GlobalService,
    private _SessionStorageService: SessionStorageService,
    private _FormularioProgressiveProfilingService: FormularioProgressiveProfilingService,
    private _RegistroVisitaPortalService: RegistroVisitaPortalService,
    public dialog: MatDialog,
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
  public IdPGeneral=0;
  public stateToekn=false;
  public datosUsuario: datosRegistroVisitaPortalDTO[] = [];
  private formData: any[] = [];
  correoUsuario: boolean = false;
  nombreUsuario: boolean = false;
  apellidoUsuario: boolean = false;
  paisUsuario: boolean = false;
  telefonoUsuario: boolean = false;
  cargoUsuario: boolean = false;
  areaFormacionUsuario: boolean = false;
  areaTrabajoUsuario: boolean = false;
  industriaUsuario: boolean = false;

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
    this.datosUsuario = [];
    this.intervaloTiempoFormularioProgresivo = setInterval(() => {
      this.usuarioWeb = this._SessionStorageService.SessionGetValue('usuarioWeb');
      if (this.usuarioWeb && this.usuarioWeb.trim() !== '') {
        clearInterval(this.intervaloTiempoFormularioProgresivo);
        this.intervaloTiempoFormularioProgresivo = null;
        this.evaluaFormularioProgressiveProfiling();
      }
    }, 1000);
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
  async evaluaFormularioProgressiveProfiling() {
    this.correoUsuario = false
    this.nombreUsuario = false;
    this.apellidoUsuario = false;
    this.paisUsuario = false;
    this.telefonoUsuario = false;
    this.cargoUsuario = false;
    this.areaFormacionUsuario = false;
    this.areaTrabajoUsuario = false;
    this.industriaUsuario = false;
    if (await this.consultarDatosUsuarioFomularioProgresivo() === true) { //Usuario encontrado por usuarioWeb
      if (this.datosUsuario) {
        this.correoUsuario = this.datosUsuario.some(usuario => usuario.correo !== undefined && usuario.correo !== null);
        this.nombreUsuario = this.datosUsuario.some(usuario => usuario.nombre !== undefined && usuario.nombre !== null);
        this.apellidoUsuario = this.datosUsuario.some(usuario => usuario.apellido !== undefined && usuario.apellido !== null);
        this.paisUsuario = this.datosUsuario.some(usuario => usuario.idPais !== undefined && usuario.idPais !== null);
        this.telefonoUsuario = this.datosUsuario.some(usuario => usuario.telefono !== undefined && usuario.telefono !== null);
        this.cargoUsuario = this.datosUsuario.some(usuario => usuario.idCargo !== undefined && usuario.idCargo !== null);
        this.areaFormacionUsuario = this.datosUsuario.some(usuario => usuario.idAreaFormacion !== undefined && usuario.idAreaFormacion !== null);
        this.areaTrabajoUsuario = this.datosUsuario.some(usuario => usuario.idAreaTrabajo !== undefined && usuario.idAreaTrabajo !== null);
        this.industriaUsuario = this.datosUsuario.some(usuario => usuario.idIndustria !== undefined && usuario.idIndustria !== null);
      }
      if (!(this.cargoUsuario || this.areaFormacionUsuario || this.areaTrabajoUsuario || this.industriaUsuario)) { // No tiene datos de 3er formulario
        this._FormularioProgressiveProfilingService.ObtenerListaFormularioProgresivo().pipe(takeUntil(this.signal$))
        .subscribe({
          next: x => {
            this.formData = x.datosFormularioProgresivo;
            if (!this.nombreUsuario) { //No tiene nombre
              if(!this.correoUsuario) { //No tiene correo
                //Lanza primer formulario (Buscamos si alguno tiene esa opción)
                this.formData.forEach((formulario: any) => {
                  if (formulario.condicionMostrar === 1 && formulario.activado === true) {
                    const tiempoSesion = formulario.tiempoSesion;
                    setTimeout(() => {
                      this.abrirFormularioProgressiveProfiling(formulario);
                    }, tiempoSesion * 1000);
                  }
                });
              }
            }
          },
          error: err => {
            console.error('Error al obtener los datos:', err);
          }
        });
      } else {
        //Ya tiene todos los datos, no busca formularios progresivos
      }
    }
    else { //Usuario no encontrado por usuarioWeb. Buscamos por defecto formulario progresivo que tenga condición "Usuario no identificado"
      this._FormularioProgressiveProfilingService.ObtenerListaFormularioProgresivo().pipe(takeUntil(this.signal$))
      .subscribe({
        next: x => {
          this.formData = x.datosFormularioProgresivo;
          this.formData.forEach((formulario: any) => {
            if (formulario.condicionMostrar === 1 && formulario.activado === true) {
              const tiempoSesion = formulario.tiempoSesion;
              setTimeout(() => {
                this.abrirFormularioProgressiveProfiling(formulario);
              }, tiempoSesion * 1000);
            }
          });
        },
        error: err => {
          console.error('Error al obtener los datos:', err);
        }
      });
      // this.InsertaRegistroVisitaPortal();
    }
  }

  async consultarDatosUsuarioFomularioProgresivo(): Promise<boolean> {
    return this._RegistroVisitaPortalService.ObtenerListaRegistroVisitaPortalPorUsuarioWeb(this.usuarioWeb)
    .pipe(takeUntil(this.signal$))
    .toPromise()
    .then(x => {
      if (x.datosRegistroVisitaPortal.length > 0) {
        this.datosUsuario = x.datosRegistroVisitaPortal;
        console.log('Usuario identificado')
        return true;
      } else {
        this.datosUsuario = [];
        console.log('Usuario no identificado')
        return false;
      }
    });
  }

  abrirFormularioProgressiveProfiling(formulario: any) {
    this.dialog.open(FormularioProgressiveProfilingComponent, {
      disableClose: true,
      data: {
        usuarioWeb: this.usuarioWeb,
        id: formulario.id,
        tipo: formulario.tipo,
        idFormularioProgresivoInicial: formulario.idFormularioProgresivoInicial,
        condicionMostrar: formulario.condicionMostrar,
        tiempoSesion: formulario.tiempoSesion,
        titulo: formulario.titulo,
        tituloTexto: formulario.tituloTexto,
        cabeceraMensajeSup: formulario.cabeceraMensajeSup,
        cabeceraMensajeSupTexto: formulario.cabeceraMensajeSupTexto,
        cabeceraMensaje: formulario.cabeceraMensaje,
        cabeceraMensajeTexto: formulario.cabeceraMensajeTexto,
        cabeceraMensajeBordes: formulario.cabeceraMensajeBordes,
        cabeceraMensajeInf: formulario.cabeceraMensajeInf,
        cabeceraMensajeInfTexto: formulario.cabeceraMensajeInfTexto,
        cabeceraBoton: formulario.cabeceraBoton,
        cabeceraBotonTexto: formulario.cabeceraBotonTexto,
        cabeceraBotonAccion: formulario.cabeceraBotonAccion,
        cuerpoMensajeSup: formulario.cuerpoMensajeSup,
        cuerpoMensajeSupTexto: formulario.cuerpoMensajeSupTexto,
        cuerpoCorreo: formulario.cuerpoCorreo,
        cuerpoCorreoOrden: formulario.cuerpoCorreoOrden,
        cuerpoCorreoObl: formulario.cuerpoCorreoObl,
        cuerpoNombres: formulario.cuerpoNombres,
        cuerpoNombresOrden: formulario.cuerpoNombresOrden,
        cuerpoNombresObl: formulario.cuerpoNombresObl,
        cuerpoApellidos: formulario.cuerpoApellidos,
        cuerpoApellidosOrden: formulario.cuerpoApellidosOrden,
        cuerpoApellidosObl: formulario.cuerpoApellidosObl,
        cuerpoPais: formulario.cuerpoPais,
        cuerpoPaisOrden: formulario.cuerpoPaisOrden,
        cuerpoPaisObl: formulario.cuerpoPaisObl,
        cuerpoTelefono: formulario.cuerpoTelefono,
        cuerpoTelefonoOrden: formulario.cuerpoTelefonoOrden,
        cuerpoTelefonoObl: formulario.cuerpoTelefonoObl,
        cuerpoCargo: formulario.cuerpoCargo,
        cuerpoCargoOrden: formulario.cuerpoCargoOrden,
        cuerpoCargoObl: formulario.cuerpoCargoObl,
        cuerpoAreaFormacion: formulario.cuerpoAreaFormacion,
        cuerpoAreaFormacionOrden: formulario.cuerpoAreaFormacionOrden,
        cuerpoAreaFormacionObl: formulario.cuerpoAreaFormacionObl,
        cuerpoAreaTrabajo: formulario.cuerpoAreaTrabajo,
        cuerpoAreaTrabajoOrden: formulario.cuerpoAreaTrabajoOrden,
        cuerpoAreaTrabajoObl: formulario.cuerpoAreaTrabajoObl,
        cuerpoIndustria: formulario.cuerpoIndustria,
        cuerpoIndustriaOrden: formulario.cuerpoIndustriaOrden,
        cuerpoIndustriaObl: formulario.cuerpoIndustriaObl,
        boton: formulario.boton,
        botonTexto: formulario.botonTexto,
        botonAccion: formulario.botonAccion
      }
    });
  }
}

interface datosRegistroVisitaPortalDTO {
  correo?: string;
  nombre?: string;
  apellido?: string;
  idPais?: number;
  telefono?: string;
  idCargo?: number;
  idAreaFormacion?: number;
  idAreaTrabajo?: number;
  idIndustria?: number;
}