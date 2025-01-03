import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { BasicBotonesExpandibles } from './Core/Models/BasicDTO';
import { GlobalService } from './Core/Shared/Services/Global/global.service';
import { HelperService } from './Core/Shared/Services/helper.service';
import { SessionStorageService } from './Core/Shared/Services/session-storage.service';
import { FormularioProgressiveProfilingService } from './Core/Shared/Services/FormularioProgressiveProfiling/formulario-progressive-profiling.service';
import { RegistroVisitaPortalService } from './Core/Shared/Services/RegistroVisitaPortal/registro-visita-portal.service';
import { MatDialog } from '@angular/material/dialog';
import { FormularioProgressiveProfilingComponent } from './Public/formulario-progressive-profiling/formulario-progressive-profiling.component';
import { ProgramasDetalleComponent } from './Public/programas-detalle/programas-detalle.component';
import { ProgramaService } from './Core/Shared/Services/Programa/programa.service';
import { LoginComponent } from './Public/login/login.component';
import { WhitepapersComponent } from './Public/bscampus/whitepapers/whitepapers.component';
import { BlogComponent } from './Public/bscampus/blog/blog.component';
import { RegistrarseComponent } from './Public/registrarse/registrarse.component';
import { LibroReclamacionesComponent } from './Public/libro-reclamaciones/libro-reclamaciones.component';
import { LandingPageInterceptorComponent } from './Public/landing-page/landing-page/landing-page-interceptor/landing-page-interceptor/landing-page-interceptor.component';
import { FormularioPublicidadInterceptorComponent } from './Public/FormularioPublicidad/FormularioPublicidadInterceptor/formulario-publicidad-interceptor.component';

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
  private intervaloTiempoAbrirFormulario: any = null;
  private intervaloTiempoFormularioProgresivo: any;
  private intervaloEvaluaPublicidad: any = null;
  tabsOpen: number = 0;

  constructor(
    private _HelperService: HelperService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private _GlobalService:GlobalService,
    private _SessionStorageService: SessionStorageService,
    private _FormularioProgressiveProfilingService: FormularioProgressiveProfilingService,
    private _RegistroVisitaPortalService: RegistroVisitaPortalService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private _ProgramaService: ProgramaService,
    private formularioService: FormularioProgressiveProfilingService
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
  datosGuardados: any;
  indicePrograma: number = 0;
  indiceCategoria: number = 0;
  auxTipoPrograma: string = "";
  auxNombrePrograma: string = "";
  auxCorreoCliente: string = "";
  
  ngOnInit() {
    console.log("Inicio Ruta ",window.frames.location);
    var deviceType = this.detectDeviceByScreen();
    const referrer = document.referrer
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
    
    let localVariable = localStorage.getItem('tabsOpen');
    console.log ('gamero localvariable: ', localVariable)
    if (localVariable !== '') {
      this.tabsOpen = Number(localVariable);
    }
    else {
      this.tabsOpen = 0;
    }
    // this.tabsOpen = parseInt(localStorage.getItem('tabsOpen') || '0', 10);
    // if (this.tabsOpen < 0) {
    //   this.tabsOpen = 0;
    // }
    // localStorage.setItem('tabsOpen', (this.tabsOpen + 1).toString());
    console.log('gamero this.tabsOpen: ', this.tabsOpen)
    if (this.tabsOpen === 0) {
      localStorage.setItem('tabsOpen', '1');
    }
    else {
      this.tabsOpen++;
      localStorage.setItem('tabsOpen', this.tabsOpen.toString());
    }

    // window.addEventListener('pagehide', () => {
    //   let currentTabsOpen = parseInt(localStorage.getItem('tabsOpen') || '0', 10);
    //   localStorage.setItem('tabsOpen', (currentTabsOpen - 1).toString());
    //   if (currentTabsOpen <= 1) {
    //     localStorage.removeItem('tabsOpen');
    //     localStorage.removeItem('tiempoformularioProgresivo');
    //     localStorage.removeItem('formularioProgresivoMostrado');
    //   }
    // });

    // window.addEventListener('storage', this.handleStorageChange);
    if (deviceType === 'Desktop') {
      window.addEventListener('pagehide', this.handleBeforeUnload);
    }
    else {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    this.eliminaFormularioPresivoActivoLocalStorage();
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

  detectDeviceByScreen(): string {
    const width = window.screen.width;
    console.log('width screen: ', width)
    if (width <= 768) {
        return 'Mobile';
    }
    if (width > 768 && width <= 1024) {
        return 'Tablet';
    }
    return 'Desktop';
  }

  handleVisibilityChange = () => {
    console.log('gamero document.visibilityState: ', document.visibilityState)
    if (document.visibilityState === 'hidden') {
      this.handlePageHide();
    }
  }

  handleBeforeUnload = () => {
    this.handlePageHide();
  }

  handlePageHide() {
    let localVariable = localStorage.getItem('tabsOpen');
    if (localVariable !== '') {
      this.tabsOpen = Number(localVariable);
    }
    else {
      this.tabsOpen = 0;
    }

    if (this.tabsOpen > 1) {
      console.log('gamero disminuye tabsOpen')
      localStorage.setItem('tabsOpen', (this.tabsOpen - 1).toString());
    }
    else {
      console.log('gamero removeItem')
      localStorage.removeItem('tabsOpen');
      localStorage.removeItem('tiempoformularioProgresivo');
      localStorage.removeItem('formularioProgresivoMostrado');
    }
  }

  handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'tabsOpen') {
      this.tabsOpen = parseInt(event.newValue || '0', 10);
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
    this.datosGuardados = null;
    if (await this.consultarDatosUsuarioFomularioProgresivo() === true) { //Usuario encontrado por usuarioWeb
      console.log('Usuario identificado')
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
      if (this.correoUsuario &&  this.nombreUsuario && this.apellidoUsuario && this.paisUsuario && this.telefonoUsuario && this.cargoUsuario && this.areaFormacionUsuario && this.areaTrabajoUsuario && this.industriaUsuario) { //Tiene todos los datos, no busca formularios progresivos
        console.log('Todos los datos de usuario completos')
      }
      else { //No tiene todos los datos
        if (this.tabsOpen === 0) {
          this._FormularioProgressiveProfilingService.ObtenerListaFormularioProgresivo().pipe(takeUntil(this.signal$))
          .subscribe({
            next: x => {
              this.formData = x.datosFormularioProgresivo;
              if (this.formData.length > 0) {
                if (!this.nombreUsuario) { //No tiene nombre
                  if(!this.correoUsuario) { //No tiene correo
                    console.log('Usuario sin correo');
                    this.formData.forEach((formulario: any) => {
                      if (formulario.condicionMostrar === 1 && formulario.activado === true) { //Condición 1: Cliente no identificado
                        localStorage.setItem('formularioProgresivo', JSON.stringify(formulario));
                        localStorage.setItem('tiempoProgramasPublicidad', JSON.stringify(formulario.tiempoProgramasPublicidad));
                        localStorage.setItem('tiempoProgramasOrganico', JSON.stringify(formulario.tiempoProgramasOrganico));
                        localStorage.setItem('tiempoBlogsWhite', JSON.stringify(formulario.tiempoBlogsWhite));
                        localStorage.setItem('tiempoIndexTags', JSON.stringify(formulario.tiempoIndexTags));
                        this.monitorTiempoFormulario(formulario);
                      }
                    });
                  }
                  else { //Tiene correo, pero no nombre
                    console.log('Usuario con correo, sin nombre');
                    this.formData.forEach((formulario: any) => {
                      if (formulario.condicionMostrar === 2 && formulario.activado === true) { //Condición 2: Cliente identificado con correo
                        localStorage.setItem('formularioProgresivo', JSON.stringify(formulario));
                        localStorage.setItem('tiempoProgramasPublicidad', JSON.stringify(formulario.tiempoProgramasPublicidad));
                        localStorage.setItem('tiempoProgramasOrganico', JSON.stringify(formulario.tiempoProgramasOrganico));
                        localStorage.setItem('tiempoBlogsWhite', JSON.stringify(formulario.tiempoBlogsWhite));
                        localStorage.setItem('tiempoIndexTags', JSON.stringify(formulario.tiempoIndexTags));
                        this.monitorTiempoFormulario(formulario);
                      }
                    });
                  }
                }
                else { //Tiene nombre
                  console.log('Usuario con nombre');
                  this.formData.forEach((formulario: any) => {
                    if (formulario.condicionMostrar === 3 && formulario.activado === true) { //Condición 3: Cliente identificado con nombre
                      localStorage.setItem('formularioProgresivo', JSON.stringify(formulario));
                      localStorage.setItem('tiempoProgramasPublicidad', JSON.stringify(formulario.tiempoProgramasPublicidad));
                      localStorage.setItem('tiempoProgramasOrganico', JSON.stringify(formulario.tiempoProgramasOrganico));
                      localStorage.setItem('tiempoBlogsWhite', JSON.stringify(formulario.tiempoBlogsWhite));
                      localStorage.setItem('tiempoIndexTags', JSON.stringify(formulario.tiempoIndexTags));
                      this.monitorTiempoFormulario(formulario);
                    }
                  });
                }
              }
            },
            error: err => {
              console.error('Error al obtener los datos:', err);
            }
          });
        }
        else {
          this.datosGuardados = JSON.parse(localStorage.getItem('formularioProgresivo') || 'null');
          this.monitorTiempoFormulario(this.datosGuardados);
        }
      }
    }
    else { //Usuario no encontrado por usuarioWeb. Buscamos por defecto formulario progresivo que tenga condición "Usuario no identificado"
      console.log('Usuario sin usuarioWeb');
      if (this.tabsOpen === 0) {
        this._FormularioProgressiveProfilingService.ObtenerListaFormularioProgresivo().pipe(takeUntil(this.signal$))
        .subscribe({
          next: x => {
            this.formData = x.datosFormularioProgresivo;
            if (this.formData.length > 0) {
              this.formData.forEach((formulario: any) => {
                if (formulario.condicionMostrar === 1 && formulario.activado === true) {
                  localStorage.setItem('formularioProgresivo', JSON.stringify(formulario));
                  localStorage.setItem('tiempoProgramasPublicidad', JSON.stringify(formulario.tiempoProgramasPublicidad));
                  localStorage.setItem('tiempoProgramasOrganico', JSON.stringify(formulario.tiempoProgramasOrganico));
                  localStorage.setItem('tiempoBlogsWhite', JSON.stringify(formulario.tiempoBlogsWhite));
                  localStorage.setItem('tiempoIndexTags', JSON.stringify(formulario.tiempoIndexTags));
                  this.monitorTiempoFormulario(formulario);
                }
              });
            }
          },
          error: err => {
            console.error('Error al obtener los datos:', err);
          }
        });
      }
      else {
        this.datosGuardados = JSON.parse(localStorage.getItem('formularioProgresivo') || 'null');
        this.monitorTiempoFormulario(this.datosGuardados);
      }
    }
  }

  tiempoMostrarFormularioProgresivo(tiempoSesion: any) {
    var formularioProgresivoPublicidad = JSON.parse(localStorage.getItem('formularioProgresivoPublicidad') || 'null');
    if (formularioProgresivoPublicidad === true ) { //Llega por publicidad, bucle para evaluar cuándo se cierra formulario de publicidad
      tiempoSesion = JSON.parse(localStorage.getItem('tiempoProgramasPublicidad') || 'null');
      this.intervaloEvaluaPublicidad = setInterval(() => {
        formularioProgresivoPublicidad = JSON.parse(localStorage.getItem('formularioProgresivoPublicidad') || 'null');
        if (formularioProgresivoPublicidad !== true) {
          clearInterval(this.intervaloEvaluaPublicidad);
          this.intervaloEvaluaPublicidad = null;
          this.formularioService.iniciarContador(tiempoSesion);
        }
      }, 1000);
    }
    else {
      this.formularioService.iniciarContador(tiempoSesion);
    }
  }

  async consultarDatosUsuarioFomularioProgresivo(): Promise<boolean> {
    return this._RegistroVisitaPortalService.ObtenerListaRegistroVisitaPortalPorUsuarioWeb(this.usuarioWeb)
    .pipe(takeUntil(this.signal$))
    .toPromise()
    .then(x => {
      if (x.datosRegistroVisitaPortal.length > 0) {
        this.datosUsuario = x.datosRegistroVisitaPortal;
        this.auxCorreoCliente  = x.datosRegistroVisitaPortal[0].correo;
        return true;
      } else {
        this.datosUsuario = [];
        this.auxCorreoCliente = "";
        return false;
      }
    });
  }

  async monitorTiempoFormulario(formulario: any) {
    const { tipoPagina } = await this.verificaComponenteActivo();
    var tiempoSesion = '';
    if (tipoPagina === 'index') {
      tiempoSesion = JSON.parse(localStorage.getItem('tiempoIndexTags') || 'null');
    }
    else if(tipoPagina === 'curso') {
      tiempoSesion = JSON.parse(localStorage.getItem('tiempoProgramasOrganico') || 'null');
    }
    else if(tipoPagina === 'blog') {
      tiempoSesion = JSON.parse(localStorage.getItem('tiempoBlogsWhite') || 'null');
    }
    else if(tipoPagina === 'whitepaper') {
      tiempoSesion = JSON.parse(localStorage.getItem('tiempoBlogsWhite') || 'null');
    }
    await this.tiempoMostrarFormularioProgresivo(tiempoSesion);
    this.intervaloTiempoAbrirFormulario = setInterval(() => {
      var tiempoAbrirFormulario = JSON.parse(localStorage.getItem('tiempoformularioProgresivo') || 'null');
      console.log('gamero tiempoAbrirFormulario: ', tiempoAbrirFormulario)
      if (tiempoAbrirFormulario === 0) {
        this.abrirFormularioProgressiveProfiling(formulario, tipoPagina);
        localStorage.removeItem('tiempoformularioProgresivo');
        localStorage.removeItem('formularioProgresivo');
        clearInterval(this.intervaloTiempoAbrirFormulario);
        this.intervaloTiempoAbrirFormulario = null;
      }
    }, 1000);
  }

  obtenerDatosPrograma() {
    this._ProgramaService.idPegeneral$.subscribe((id) => {
      this.indicePrograma = id;
    });

    this._ProgramaService.idCategoria$.subscribe((id) => {
      this.indiceCategoria = id;
      if (this.indiceCategoria === 3) {
        this.auxTipoPrograma = "Programa";
      }
      else if (this.indiceCategoria === 4) {
        this.auxTipoPrograma = "Curso";
      }
      else {
        this.auxTipoPrograma = "";
      }
    });

    this._ProgramaService.nombreProgramaCurso$.subscribe((nombre) => {
      this.auxNombrePrograma = nombre;
    });
  }

  async abrirFormularioProgressiveProfiling(formulario: any, tipoPagina: string) {
    console.log('gamero formulario: ', formulario)
    this.obtenerDatosPrograma();
    var { tipoPagina } = await this.verificaComponenteActivo();
    var aulaVirtual = false;
    var formularioProgresivoMostrado = false;
    if (this._SessionStorageService.validateTokken()) {
      aulaVirtual = true
    }
    formularioProgresivoMostrado = JSON.parse(localStorage.getItem('formularioProgresivoMostrado') || 'null');
    if (document.visibilityState === 'visible' && aulaVirtual === false && formularioProgresivoMostrado !== true) {
      if (tipoPagina === 'index' || tipoPagina === 'curso' || tipoPagina === 'blog' || tipoPagina === 'whitepaper') {
        this.dialog.open(FormularioProgressiveProfilingComponent, {
          disableClose: true,
          data: {
            tipoPagina: tipoPagina,
            indicePrograma: this.indicePrograma,
            auxTipoPrograma: this.auxTipoPrograma,
            auxNombrePrograma: this.auxNombrePrograma,
            auxCorreoCliente: this.auxCorreoCliente,
            usuarioWeb: this.usuarioWeb,
            id: formulario.id,
            tipo: formulario.tipo,
            idFormularioProgresivoInicial: formulario.idFormularioProgresivoInicial,
            condicionMostrar: formulario.condicionMostrar,
            tiempoSesion: formulario.tiempoIndexTags,
            titulo: formulario.titulo,
            tituloTexto: formulario.tituloTexto,
            cabeceraMensajeSup: formulario.cabeceraMensajeSup,
            cabeceraMensajeSupTexto: formulario.cabeceraMensajeSupTexto,
            cabeceraMensaje: formulario.cabeceraMensaje,
            cabeceraMensajeIndexCurso: formulario.cabeceraMensajeIndexCurso,
            cabeceraMensajeTexto: formulario.cabeceraMensajeTexto,
            cabeceraMensajeTextoCurso: formulario.cabeceraMensajeTextoCurso,
            cabeceraMensajeBordes: formulario.cabeceraMensajeBordes,
            cabeceraMensajeInf: formulario.cabeceraMensajeInf,
            cabeceraMensajeInfIndexCurso: formulario.cabeceraMensajeInfIndexCurso,
            cabeceraMensajeInfTexto: formulario.cabeceraMensajeInfTexto,
            cabeceraMensajeInfTextoCurso: formulario.cabeceraMensajeInfTextoCurso,
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
  }

  async verificaComponenteActivo(): Promise<{ tipoPagina: string}> {
    let tipoPagina = 'index';
    const currentRoute = this.activatedRoute.root;
    let route = currentRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    if (route.routeConfig?.component === ProgramasDetalleComponent) {
      tipoPagina = 'curso';
    }
    else if (route.routeConfig?.component === BlogComponent) {
      tipoPagina = 'blog';
    }
    else if (route.routeConfig?.component === WhitepapersComponent) {
      tipoPagina = 'whitepaper';
    }
    else if (route.routeConfig?.component === LoginComponent) {
      tipoPagina = 'login';
    }
    else if (route.routeConfig?.component === RegistrarseComponent) {
      tipoPagina = 'registrarse';
    }
    else if (route.routeConfig?.component === LibroReclamacionesComponent) {
      tipoPagina = 'libroReclamaciones';
    }
    else if (route.routeConfig?.component === LandingPageInterceptorComponent) {
      tipoPagina = 'landingPageInterceptor';
    }
    else if (route.routeConfig?.component === FormularioPublicidadInterceptorComponent) {
      tipoPagina = 'formularioPublicidadInterceptor';
    }

    return { tipoPagina };
  }
  
  
  eliminaFormularioPresivoActivoLocalStorage() {
    if (this.tabsOpen === 0) {
      localStorage.removeItem('formularioProgresivo Activo');
    }
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