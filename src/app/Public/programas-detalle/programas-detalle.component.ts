import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Basic, CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { BeneficiosDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { estructuraCursoDTO } from 'src/app/Core/Models/EstructuraProgramaDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import {
  FormularioContactoDTO,
  FormularioContactoShortDTO,
} from 'src/app/Core/Models/FormularioDTO';
import { listaExpositorDTO } from 'src/app/Core/Models/listaExpositorDTO';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import {
  programaCabeceraDetalleDTO,
  listaSeccionPrograma,
  listaPrerrequisitoDTO,
  listaCertificacionDTO,
  listaMontoPagoProgramaInformacionDTO,
} from 'src/app/Core/Models/SeccionProgramaDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { ExpositorService } from 'src/app/Core/Shared/Services/Expositor/expositor.service';
import { HelperService } from 'src/app/Core/Shared/Services/Helper/helper.service';
import { HelperService as Help} from 'src/app/Core/Shared/Services/helper.service';
import { ProgramaService } from 'src/app/Core/Shared/Services/Programa/programa.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TagService } from 'src/app/Core/Shared/Services/Tag/tag.service';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { Router } from '@angular/router';


import { VistaPreviaComponent } from './vista-previa/vista-previa.component';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { ProgramaPagoComponent } from './programa-pago/programa-pago.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { PagoOrganicoAlumnoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { Subject, takeUntil } from 'rxjs';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { ProgramaFormularioComponent } from './programa-formulario/programa-formulario.component';
import { FormularioAzulComponent } from 'src/app/Core/Shared/Containers/formulario-azul/formulario-azul.component';
declare const fbq:any;
declare const gtag:any;
@Component({
  selector: 'app-programas-detalle',
  templateUrl: './programas-detalle.component.html',
  styleUrls: ['./programas-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ProgramasDetalleComponent implements OnInit ,OnDestroy{
  private signal$ = new Subject();
  isBrowser: boolean;
  @ViewChild(FormularioAzulComponent)
  form!: FormularioAzulComponent;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _SeccionProgramaService: SeccionProgramaService,
    private _ProgramaService: ProgramaService,
    private _BeneficioService: BeneficioService,
    private _SilaboService: SilaboService,
    private _ExpositorService: ExpositorService,
    private _TagService: TagService,
    private _RegionService: RegionService,
    private _DatosPortalService: DatosPortalService,
    private _HelperService: HelperService,
    private _HelperServiceP:Help,
    private _AccountService: AccountService,
    private _router:Router,
    public dialog: MatDialog,
    private _SnackBarServiceService: SnackBarServiceService,
    config: NgbCarouselConfig,
    @Inject(PLATFORM_ID) platformId: Object,
    private _SessionStorageService:SessionStorageService,
    private _FormaPagoService:FormaPagoService,
    private _SeoService:SeoService,
    private title:Title
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    config.interval = 20000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  public charge=false
  public step=-1;
  public CodigoIso=''
  public OpenChat=false;
  public cargaChat=false;
  public rutaProgramaDetalle:any;
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public jsonEnvioPago:PagoOrganicoAlumnoDTO={
    CodigoBanco:'',
    IdFormaPago:0,
    IdMontoPago:0,
    IdPais:0,
    IdPasarelaPago:'',
    IdPEspecifico:0,
    IdPGeneral:0,
    MontoTotalPago:0,
    RequiereTarjeta:true,
    TipoProveedor:'',
    WebMoneda:0,
    MedioCodigo:'',
    MedioPago:'',
    Moneda:'',
    Inicio:'',
    Tipo:'',
    Version:'',
  }
  public area = '';
  public idBusqueda = 0;
  public contenidoCabecera = '';
  public tags: Array<listaTagDTO> = [];
  public esAonline=false
  public cabecera: programaCabeceraDetalleDTO = {
    areaCapacitacion: '',
    areaDescripcion: '',
    duracion: '',
    imagenPrograma: '',
    imgPrincipal: '',
    listProgramaEspecificoInformacionDTO: [],
    nombre: '',
    nombreSubArea: '',
    subAreaDescripcion: '',
    tituloHtml: '',
    idPartner:0
  };
  public idBr=''
  public seccion: listaSeccionPrograma = {
    duracionHorario: '',
    metodologiaOnline: '',
    objetivo: '',
    publicoObjetivo: '',
    video: '',
    vistaPrevia: '',
  };
  public prerequisitos: listaPrerrequisitoDTO = {
    cabecera: '',
    contenido: [],
    piePagina: '',
  };
  public certificado: listaCertificacionDTO = {
    cabecera: '',
    contenido: [],
    piePagina: '',
    descripcion: '',
    descripcionBody: [],
    descripcionHeader: [],
    descripcionLeyenda: '',
  };
  public expositor: Array<listaExpositorDTO> = [];
  public stepExpositors: Array<Array<listaExpositorDTO>> = [];
  public estructuraPrograma: Array<estructuraCursoDTO> = [];
  public beneficios: Array<BeneficiosDTO> = [];
  public programasRelacionados: Array<CardProgramasDTO> = [];
  public idPegeneral = 0;
  public MontoPago: Array<listaMontoPagoProgramaInformacionDTO> = [];
  public BeneficiosPiePagina = '';
  public EstructuraPiePagina = '';
  public PrerrequisitosPiePagina = '';
  public CertificacionPiePagina = '';
  public seccionStep = 2;
  public innerWidth: any;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public cleanSub=false
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Programas, certificaciones y cursos',
      urlWeb: '/programas-certificaciones-cursos',
    },
  ];
  public fileds: Array<formulario> = [];
  public formularioContacto: FormularioContactoShortDTO = {
    Nombres: '',
    Apellidos: '',
    Email: '',
    IdPais: undefined,
    IdRegion: undefined,
    Movil: '',
  };
  public DatosEnvioFormulario: ContactenosDTO = {
    Nombres: '',
    Apellidos: '',
    Correo1: '',
    IdPais: undefined,
    IdRegion:undefined,
    Movil: '',
    IdCargo: undefined,
    IdAreaFormacion: undefined,
    IdAreaTrabajo: undefined,
    IdIndustria: undefined,
  };
  public nombreProgramCompeto = '';
  public AraCompleta = '';
  public vistaPrevia = '';
  public Paises:any;
  public IdPais=-1;
  public codigoIso:string = 'INTC';
  public alumno='';
  public combosPrevios:any;
  public IdPespecificoPrograma=0;
  public VistaPreviaPortal='';
  public PrimerCurso='';
  public ExisteVideo=false;
  public CompleteLocalStorage=false;
  public datos: DatosFormularioDTO ={
    nombres:'',
    apellidos:'',
    email:'',
    idPais:undefined,
    idRegion:undefined,
    movil:'',
    idCargo:undefined,
    idAreaFormacion:undefined,
    idAreaTrabajo:undefined,
    idIndustria:undefined,
  }
  public porcentajeDescuento='';
  public textoDescuento='';
  public certificadoVacio=false;
  public TextoFormulario="Necesitas más información";
  public esPadre=false;
  ngOnInit(): void {

    // this.addPlayer()
    this._HelperServiceP.recibirChangePais().pipe(takeUntil(this.signal$)).subscribe((x) => {
      if (this.isBrowser) {
        location.reload();
      }
    });
    if (this.isBrowser) {
      setTimeout(() => {
        this.OpenChat=true;
      }, 30000);
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 992) this.seccionStep = 2;
      if (this.innerWidth < 768) this.seccionStep = 1;
    }
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        this.rutaProgramaDetalle=x
        this.area = x['AreaCapacitacion'].split('-').join(' ');
        this.AraCompleta = x['AreaCapacitacion'];
        this.nombreProgramCompeto = x['ProgramaNombre'];
        var namePrograma = x['ProgramaNombre'].split('-');

        this.idBusqueda = namePrograma[namePrograma.length - 1];


      },
      error: () => {
        this._router.navigate(['error404']);
      },
    });


    this._HelperServiceP.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.Paises=x;
      }
    })
    this.ObtenerCabeceraProgramaGeneral();
    this.obtenerFormularioCompletado();
    this.AddFields();
    this.ObtenerCombosPortal();
  }

  RegistrarProgramaPrueba(){
    var token=this._SessionStorageService.validateTokken()
    if(token){
      this._AccountService.RegistroCursoAulaVirtualNueva(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this._router.navigate(['/AulaVirtual/MisCursos']);
        },
      })
    }else{
      this._SessionStorageService.SessionSetValueSesionStorage("accesoPrueba",this.idBusqueda.toString());
      this._router.navigate(['/login']);
    }
  }

  OpenModal(): void {
    const dialogRef = this.dialog.open(VistaPreviaComponent, {
      width: '561px',
      data: { url: this.VistaPreviaPortal },
      panelClass: 'custom-dialog-container',
    });

  }
  OpenModalFormulario(opcionTexto:number): void {
    if(opcionTexto==2){
      this.TextoFormulario="Consultar opción de pago personalizado"
    }
    const dialogRef = this.dialog.open(ProgramaFormularioComponent, {
      width: '400px',height:'570px',
      data: { IdPespecificoPrograma:this.IdPespecificoPrograma,
              IdBusqueda:this.idBusqueda,
              TextoFormulario:this.TextoFormulario },
      panelClass: 'formulario-container',
    });

  }
  OpenModalPago(){
    this.codigoIso =
      this._SessionStorageService.SessionGetValue('ISO_PAIS') != ''
        ? this._SessionStorageService.SessionGetValue('ISO_PAIS')
        : 'INTC';
    this.IdPais=this.GetIdPaisProCodigo();
    const dialogRef = this.dialog.open(ProgramaPagoComponent, {
      width: '900px',
      data: {
        idPais: this.IdPais ,
        idBusqueda:this.idBusqueda,
        alumno:this.alumno,
        nombre:this.cabecera.nombre,
        modalidad:this.cabecera.listProgramaEspecificoInformacionDTO,
        rutaProgramaDetalle:this.rutaProgramaDetalle},
      panelClass: 'programa-pago-dialog-container',
    });
    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){

        this.PreProcesoPagoOrganicoAlumno(result);
      }
    });
  }
  PreProcesoPagoOrganicoAlumno(tarjeta:any){

    const dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    //this.jsonEnvioPago.CodigoBanco=tarjeta.medioCodigo;
    this.jsonEnvioPago.IdFormaPago=tarjeta.idFormaPago;
    //this.jsonEnvioPago.IdMontoPago=;
    this.jsonEnvioPago.IdPEspecifico=tarjeta.idPEspecifico;
    this.jsonEnvioPago.IdPGeneral=this.idPegeneral;
    this.jsonEnvioPago.IdPais=this.IdPais;
    this.jsonEnvioPago.IdPasarelaPago=tarjeta.idPasarelaPago.toString();
    this.jsonEnvioPago.MedioCodigo=tarjeta.medioCodigo;;
    this.jsonEnvioPago.MedioPago=tarjeta.medioPago;
    this.jsonEnvioPago.Moneda=tarjeta.moneda;
    this.jsonEnvioPago.MontoTotalPago=tarjeta.montoTotal;
    this.jsonEnvioPago.Inicio=tarjeta.inicio;
    this.jsonEnvioPago.Version=tarjeta.version;
    this.jsonEnvioPago.Tipo=tarjeta.tipo;
    //this.jsonEnvioPago.TipoProveedor=;
    this.jsonEnvioPago.WebMoneda=tarjeta.webMoneda;
    var token=this._SessionStorageService.validateTokken();
    if(token){
      this._FormaPagoService.PreProcesoPagoOrganicoAlumno(this.jsonEnvioPago,dialogRef);
      this._SessionStorageService.SessionSetValue('urlRedireccionErrorPago',JSON.stringify(this.rutaProgramaDetalle));

    }else{
      this._SessionStorageService.SessionSetValue('redirect','pago');
      this._SessionStorageService.SessionSetValue('datosTarjeta',JSON.stringify(this.jsonEnvioPago));
      this._router.navigate(['/login']);
      this._SessionStorageService.SessionSetValueSesionStorage("PagoPublicidad","1");
      dialogRef.close()
    }

  }
  GetIdPaisProCodigo():number{
    var idp=0
    this.Paises.forEach((p:any)=>{
      if(p.codigoIso.toLowerCase()==this.codigoIso.toLowerCase()){
        idp=parseInt(p.idPais);
      }
    })
    return idp;
  }
  removeAccents(strng:string){
    return strng.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }
  ObtenerCabeceraProgramaGeneral() {
    this._SeccionProgramaService
      .ObtenerCabeceraProgramaGeneral(this.idBusqueda).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if(x.programaCabeceraDetalleDTO!=undefined
            && this.removeAccents(this.area.toLowerCase())==this.removeAccents(x.programaCabeceraDetalleDTO.areaCapacitacion.toLowerCase()))
          {

            var metas=x.programaCabeceraDetalleDTO.parametroSeoProgramaDTO;
            if(metas.length>0){

              let mt=metas.find((x:any)=>x.nombre=='Titulo Pestaña')!=undefined?
                        metas.find((x:any)=>x.nombre=='Titulo Pestaña').descripcion:undefined
              let t=metas.find((x:any)=>x.nombre=='title')!=undefined?
                        metas.find((x:any)=>x.nombre=='title').descripcion:undefined
              let d=metas.find((x:any)=>x.nombre=='description')!=undefined?
                        metas.find((x:any)=>x.nombre=='description').descripcion:undefined
              let k=metas.find((x:any)=>x.nombre=='keywords')!=undefined?
                        metas.find((x:any)=>x.nombre=='keywords').descripcion:undefined
              this.title.setTitle(t);

              this._SeoService.generateTags({
                title:mt,
                slug:'AcercaBsGrupo',
                image:'https://img.bsginstitute.com/repositorioweb/img/programas/'+x.programaCabeceraDetalleDTO.imagenPrograma,
                description:d,
                ogTitle:t,
                twiterTitle:t,
                keywords:k,
                ogDescription:d,
                twiterDescription:d ,
                imageW:"348",
                imageH:'220',
              });

            }
            this.cabecera = x.programaCabeceraDetalleDTO;
            if(this.cabecera.tituloHtml!=null){
              this.cabecera.tituloHtml = "<h1>"+this.cabecera.tituloHtml+"</h1>";
              this.cabecera.tituloHtml = this.cabecera.tituloHtml.replace("<h1><h1>","<h1>").replace("</h1></h1>","</h1>");
            }
            console.log(this.cabecera)

            if(x.programaCabeceraDetalleDTO.listProgramaEspecificoInformacionDTO.length>0){
              this.IdPespecificoPrograma = x.programaCabeceraDetalleDTO.listProgramaEspecificoInformacionDTO[0].id
              this.cabecera.listProgramaEspecificoInformacionDTO.forEach(x=>{
                if(x.tipo.toLowerCase()=='online asincronica'){
                  this.esAonline=true
                }
              })
            }
            this.migaPan.push({
              titulo:
                'Área: ' +
                this.area +
                '/ Subárea: ' +
                this.cabecera.nombreSubArea,
                urlWeb: '/' + this.AraCompleta + '/' + this.nombreProgramCompeto,
              });
            if (x.programaCabeceraDetalleDTO.imgPrincipal != null) {
              this.cabecera.imgPrincipal =
                'https://img.bsginstitute.com/repositorioweb/img/partners/' +
                x.programaCabeceraDetalleDTO.imgPrincipal;
            };
            console.log(this.cabecera.imgPrincipal)

            this.ListMontoPago();
            this.ListSeccionPrograma();
            if (this.isBrowser) {
              this.ListPrerrequisito();
              this.EstructuraProgramaPortal();
              this.ListBeneficioPrograma();
              this.ListCertificacion();
              this.ListExpositor();
              this.ListTagProgramaRelacionadoPorIdBusqueda();
              this.obtenerErrorPagoModal();
            }
          }
          else{
            this._router.navigate(['error404']);
          }
        },
        error: (e) => {
          this._router.navigate(['error404']);
        },
      });

  }
  ListSeccionPrograma() {
    this._SeccionProgramaService
      .ListSeccionPrograma(this.idBusqueda).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if(x.listaSeccionPrograma.video!=null){
            if (x.listaSeccionPrograma.video.includes('vimeo')) {
              this.contenidoCabecera = x.listaSeccionPrograma.video
                .split('<p>')
                .join('')
                .split('<vacio></vacio>')
                .join('')
                .split('&lt;')
                .join('<')
                .split('&gt;')
                .join('>')
                .split('src=')
                .join('id="presentacionVideo" src=')
                .split('""')
                .join('"');
            } else {
              var splitCont = x.listaSeccionPrograma.video.split('</p><p>');
              this.contenidoCabecera = splitCont[splitCont.length - 1]
                .split('</p>')
                .join('');
            }
          }
          this.seccion = x.listaSeccionPrograma;
          this.seccion.objetivo=this.seccion.objetivo==null?'':this.seccion.objetivo
          this.seccion.publicoObjetivo=this.seccion.publicoObjetivo==null?'':this.seccion.publicoObjetivo
          this.seccion.duracionHorario=this.seccion.duracionHorario==null?'':this.seccion.duracionHorario
        },
      });
  }

  ListPrerrequisito() {
    this._SeccionProgramaService.ListPrerrequisito(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.prerequisitos = x.listaPrerrequisitoDTO;
        console.log(this.prerequisitos)
      },
    });
  }
  EstructuraProgramaPortal() {
    this._ProgramaService.EstructuraProgramaPortal(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        this.PrimerCurso=x.estructuraCurso[0].titulo
        this.estructuraPrograma = x.estructuraCurso;
        console.log(this.estructuraPrograma)
        this.estructuraPrograma.map((x) => {
          if (x.titulo.includes('Curso')) {
            this.esPadre = true;
          }
          console.log(this.esPadre)
        });
        this.estructuraPrograma.map((y) => {
          if (this.estructuraPrograma.length > 3) {
            y.opened = false;
          } else {
            y.opened = true;
          }
        });
        this.idPegeneral = x.idPGeneral;
        this.ObtenerSilaboCurso();
        this.ListProgramaRelacionado();
        this.VistaPreviaProgramaPortal();

        //this.prerequisitos=x.listaPrerrequisitoDTO;
      },
    });
  }
  ListBeneficioPrograma() {
    this._BeneficioService.ListBeneficioPrograma(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.beneficios = x.listaBeneficioProgramaDTO;
        console.log(this.beneficios)
        if(this.beneficios!=null){
          let i = 1;
          var beneficioLista: Array<number> = [];
          if(this.cabecera.idPartner==78 && this.beneficios.length>=3){
            while (i <= 2) {
              var TipoBeneficio = this.beneficios.find((x) => x.paquete == 1);
              if (TipoBeneficio != undefined) {
                TipoBeneficio.contenido.forEach((element) => {
                  if (element.idBeneficio > 0) {
                    beneficioLista.push(element.idBeneficio);
                  }
                });
                this.beneficios.forEach((x) => {
                  if (x.paquete == i + 1) {
                    var existe = false;
                    x.contenido.forEach((c) => {
                      if (beneficioLista.indexOf(c.idBeneficio) > -1) {
                        c.idBeneficio = 0;
                        existe = true;
                      }
                    });
                    if (existe) {
                      if (i == 1) {
                        x.contenido.unshift({
                          contenido:
                            'Todos los beneficios de la versión básica ademas de:',
                          idBeneficio: -1,
                        });
                      }
                      if (i == 2) {
                        x.contenido.unshift({
                          contenido:
                          'Todos los beneficios de la versión básica ademas de:',
                          idBeneficio: -1,
                        });
                      }
                    }
                  }
                });
              }
              i++;
            }
          }else{
            while (i <= 2) {
              var TipoBeneficio = this.beneficios.find((x) => x.paquete == i);
              if (TipoBeneficio != undefined) {
                TipoBeneficio.contenido.forEach((element) => {
                  if (element.idBeneficio > 0) {
                    beneficioLista.push(element.idBeneficio);
                  }
                });
                this.beneficios.forEach((x) => {
                  if (x.paquete == i + 1) {
                    var existe = false;
                    x.contenido.forEach((c) => {
                      if (beneficioLista.indexOf(c.idBeneficio) > -1) {
                        c.idBeneficio = 0;
                        existe = true;
                      }
                    });
                    if (existe) {
                      if (i == 1) {
                        x.contenido.unshift({
                          contenido:
                            'Todos los beneficios de la versión básica ademas de:',
                          idBeneficio: -1,
                        });
                      }
                      if (i == 2) {
                        x.contenido.unshift({
                          contenido:
                            'Todos los beneficios de la versión profesional ademas de:',
                          idBeneficio: -1,
                        });
                      }
                    }
                  }
                });
              }
              i++;
            }
          }
        }
      },
    });
  }
  ObtenerSilaboCurso() {
    this._SilaboService.ObtenerSilaboCurso(this.idPegeneral).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        var piePag = x.listaSeccionesContenidosDocumento.find(
          (x: any) => x.titulo == 'Beneficios'
        );
        if (piePag != undefined) {
          this.BeneficiosPiePagina = piePag.piePagina;
        }
        var piePag = x.listaSeccionesContenidosDocumento.find(
          (x: any) => x.titulo == 'Certificacion'
        );
        if (piePag != undefined) {
          this.CertificacionPiePagina = piePag.piePagina;
        }
        var piePag = x.listaSeccionesContenidosDocumento.find(
          (x: any) => x.titulo == 'Descripci&#243;n Estructura'
        );
        if (piePag != undefined) {
          this.EstructuraPiePagina = piePag.piePagina;
          if (piePag.piePagina.trim() == '') {
            this.EstructuraPiePagina = piePag.contenido;
          }
        }
        var piePag = x.listaSeccionesContenidosDocumento.find(
          (x: any) => x.titulo == 'Prerrequisitos'
        );
        if (piePag != undefined) {
          this.PrerrequisitosPiePagina = piePag.piePagina;
        }
        var vp = x.listaSeccionesContenidosDocumento.find(
          (x: any) => x.titulo == 'Vista Previa'
        );
        if (vp != undefined) {
          this.vistaPrevia = vp.contenido
            .split('<p>')
            .join('')
            .split('</p>')
            .join('')
            .split('<!--Vacio-->')
            .join('')
            .split('<vacio></vacio>')
            .join('')
            .split('http:')
            .join('https:');
        }
      },
    });
  }
  ListCertificacion() {
    this._SeccionProgramaService.ListCertificacion(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.certificado = x.listaCertificacionDTO;
        console.log(this.certificado)
        if (this.certificado!=null && this.certificado.descripcion != null && this.certificado.contenido.length!=0) {
          var descstrong = this.certificado.descripcion.split('<p><strong>');
          var desc = [];
          this.certificado.descripcionHeader=[]
          this.certificado.descripcionBody=[]
          this.certificado.descripcionLeyenda = this.certificado.descripcion;

          // if (descstrong.length > 1) {
          //   let i = 0;
          //   descstrong.forEach((d) => {
          //     if (i != 0) {
          //       desc = d.split('</strong></p>');
          //       if (desc.length > 1 && desc[1]!='') {
          //         let j = 0;
          //         this.certificado.descripcionHeader.push('<p><strong>' + desc[0] );
          //         let dc = '';
          //         desc.forEach((d2) => {
          //           if (j != 0) {
          //             dc += d2 + '</strong></p>';
          //           }
          //           j++;
          //         });
          //         this.certificado.descripcionBody.push(dc);
          //       }else{
          //         this.certificado.descripcionLeyenda+='<br><strong>'+desc[0]+'<strong>';
          //       }
          //     }
          //     i++;
          //   });
          //   // this.certificado.descripcionHeader=desc[0]+'</strong></p>'
          //   // let i=0;
          //   // this.certificado.descripcionBody='';
          //   // desc.forEach(d=>{
          //   //   if(i!=0){
          //   //     this.certificado.descripcionBody+=d+'</strong></p>'
          //   //   }
          //   //   i++;
          //   // })
          // }
        }
        else{
          this.certificadoVacio=true;
        }
      },
    });
  }
  ListExpositor() {
    this._ExpositorService.ListExpositor(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.expositor = x.listaExpositorDTO;
        var ind = 1;
        var step: Array<any> = [];
        this.expositor.forEach((p) => {
          step.push(p);
          if (ind == this.seccionStep) {
            this.stepExpositors.push(step);
            step = [];
            ind = 0;
          }
          ind++;
        });
        if (step.length > 0) {
          this.stepExpositors.push(step);
        }
      },
    });
  }
  ListMontoPago() {
    this._SeccionProgramaService.ListMontoPago(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.MontoPago = x.listaMontoPagoProgramaInformacionDTO;
        console.log(this.MontoPago)
        if(this.MontoPago[0].textoCabeceraDescuento!=null ||this.MontoPago[0].textoCabeceraDescuento!=undefined){
          var descuento = this.MontoPago[0].textoCabeceraDescuento
          var descuentoSplit = descuento.split('%')
          this.porcentajeDescuento = descuentoSplit[0]
          this.textoDescuento = descuentoSplit[1]
        }
        if (x.listaMontoPagoProgramaInformacionDTO != null) {
          this.MontoPago.sort(function (a, b) {
            return a.idTipoPago - b.idTipoPago;
          });
        }
      },
    });
  }
  ListProgramaRelacionado() {
    this._SeccionProgramaService
      .ListProgramaRelacionado(this.idPegeneral).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          if (x.listaProgramaRelacionadoDTO != null) {
            this.programasRelacionados = x.listaProgramaRelacionadoDTO.map(
              (c: any) => {
                var urlArea = c.areaCapacitacion.replace(/\s+/g, '-');
                var urlSubArea = c.nombre.split(' - ').join('-');
                var urlSubArea = urlSubArea.replace(/\s+/g, '-');
                var ps: CardProgramasDTO = {
                  Inversion: c.montoPagoDescripcion,
                  Content: c.descripcion,
                  Url: c.direccion,
                  Img:
                    'https://img.bsginstitute.com/repositorioweb/img/programas/' +
                    c.imagen,
                  ImgAlt: c.imagenAlt,
                  Title: c.nombre,
                };
                return ps;
              }
            );
          }
        },
      });
  }
  ListTagProgramaRelacionadoPorIdBusqueda() {
    this._TagService
      .ListTagProgramaRelacionadoPorIdBusqueda(this.idBusqueda).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.tags = x.listaTagDTO;
          if(this.tags!=null){
            this.tags.forEach((x) => {
              x.codigo = '/tag/' + x.codigo;
            });
          }
        },
      });
  }
  ScrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }
  obtenerFormularioCompletado(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.formularioContacto.Nombres=datos.nombres;
      this.formularioContacto.Apellidos=datos.apellidos;
      this.formularioContacto.Email=datos.email;
      this.formularioContacto.IdPais=datos.idPais;
      this.formularioContacto.IdRegion=datos.idRegion;
      this.formularioContacto.Movil=datos.movil;
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
      this.CompleteLocalStorage=true;
    }
    else{
      this.CompleteLocalStorage=false;
    }
  }
  SetContacto(value: any) {
    if (!this.formVal) {
      this._SnackBarServiceService.openSnackBar(
        'Debes completar todos los campos',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
    } else {
      this.statuscharge=true;
      this.initValues = false;
      this.DatosEnvioFormulario.Nombres = value.Nombres;
      this.DatosEnvioFormulario.Apellidos = value.Apellidos;
      this.DatosEnvioFormulario.Correo1 = value.Email;
      this.DatosEnvioFormulario.IdPais = value.IdPais;
      this.DatosEnvioFormulario.IdRegion = value.IdRegion;
      this.DatosEnvioFormulario.Movil = value.Movil;
      this.DatosEnvioFormulario.IdCargo = value.IdCargo;
      this.DatosEnvioFormulario.IdAreaFormacion = value.IdAreaFormacion;
      this.DatosEnvioFormulario.IdAreaTrabajo = value.IdAreaTrabajo;
      this.DatosEnvioFormulario.IdIndustria = value.IdIndustria;
      var IdPEspecifico=this._SessionStorageService.SessionGetValueCokies("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueCokies("idCategoria");
      var idcampania=this._SessionStorageService.SessionGetValueCokies("idCampania");
      this.DatosEnvioFormulario.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);
      if(IdPEspecifico==''){
        this.DatosEnvioFormulario.IdPespecifico=this.IdPespecificoPrograma;
      }else{
        this.DatosEnvioFormulario.IdPespecifico=parseInt(IdPEspecifico)
      };
      this.DatosEnvioFormulario.IdCampania = parseInt(idcampania);
      this._HelperService
        .EnviarFormulario(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            this.cleanSub=false;
            this.datos.nombres = this.DatosEnvioFormulario.Nombres;
            this.datos.apellidos = this.DatosEnvioFormulario.Apellidos;
            this.datos.email = this.DatosEnvioFormulario.Correo1;
            this.datos.idPais = this.DatosEnvioFormulario.IdPais;
            this.datos.idRegion = this.DatosEnvioFormulario.IdRegion;
            this.datos.movil = this.DatosEnvioFormulario.Movil;
            var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
            if(DatosFormulario!=''){
              var datosPrevios = JSON.parse(DatosFormulario);
              this.datos.idCargo=datosPrevios.idCargo;
              this.datos.idAreaFormacion=datosPrevios.idAreaFormacion;
              this.datos.idAreaTrabajo=datosPrevios.idAreaTrabajo;
              this.datos.idIndustria=datosPrevios.idIndustria;
            }
            this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
            this.CompleteLocalStorage=true;
            if(this.isBrowser){
              fbq('track', 'CompleteRegistration');
              gtag('event', 'conversion', {
                'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
              });
              gtag('event', 'conversion', {
                  'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
              });
              gtag('event', 'conversion', {
                'send_to': 'AW-11065656821/6CM8CNWQ2IcYEPWLwpwp',
              });
            }
            this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
          },
          complete: () => {
            //this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
            this.statuscharge = false;
            this.obtenerFormularioCompletado();
          },
        });
    }
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x);
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data=x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
          }
        })
      }
    })
    this.initValues = true;
  }
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.fileds.forEach(r=>{
          if(r.nombre=='IdRegion'){
            r.disable=false;
            r.data=x.map((p:any)=>{
              var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
              return ps;
            })
          }
        })
        this.form.enablefield('IdRegion');
      }
    })
  }
  SelectChage(e:any){
    if(e.Nombre=="IdPais"){
      this.GetRegionesPorPais(e.value)
    }
  }
  AddFields() {
    this.fileds.push({
      nombre:"Nombres",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Nombres",
    });
    this.fileds.push({
      nombre:"Apellidos",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Apellidos",

    });
    this.fileds.push({
      nombre:"Email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"E-mail",

    });
    this.fileds.push({
      nombre:"IdPais",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"País",
    });
    this.fileds.push({
      nombre: 'IdRegion',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      disable: true,
      label: 'Región',
    });
    this.fileds.push({
      nombre:"Movil",
      tipo:"phone",
      valorInicial:"",
      validate:[Validators.required],
      label:"Teléfono Móvil",
    });
    this.fileds.push({
      nombre: 'terminos',
      tipo: 'terminos',
      valorInicial: '',
      validate: [Validators.required,Validators.requiredTrue],
      label: 'terminos',
      style:'font-size: 12px;margin-bottom: 20px;'
    });
  }
  LimpiarCampos(){
    this.CompleteLocalStorage=false;
    this._SessionStorageService.SessionDeleteValue('DatosFormulario');
    this.combosPrevios=undefined;
    this.formularioContacto.Nombres= '',
    this.formularioContacto.Apellidos= '',
    this.formularioContacto.Email= '',
    this.formularioContacto.IdPais=undefined,
    this.formularioContacto.IdRegion=undefined,
    this.formularioContacto.Movil= '',
    this.GetRegionesPorPais(-1);
  }

  chatcharge(estado:boolean){
    this.cargaChat=estado
  }
  EventoInteraccionButton(nombre:string){
    this._HelperServiceP.enviarMsjAcciones({Tag:"Button",Nombre:nombre})
  }
  EventoInteraccionTab(nombre:string){
    this._HelperServiceP.enviarMsjAcciones({Tag:"Tab",Nombre:nombre})
  }

  EventoInteraccionAccordion(nombre:string,estado:string){
    this._HelperServiceP.enviarMsjAcciones({Tag:'Accordion',Nombre:nombre,Estado:estado,Seccion:'Estructura Curricular'})
  }
  EventoInteraccionAccordionCertificado(nombre:string,estado:string){
    this._HelperServiceP.enviarMsjAcciones({Tag:'Accordion',Nombre:nombre,Estado:estado,Seccion:'Certificación'})
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.EventoInteraccionTab(tabChangeEvent.tab.textLabel)
  }
  EventoInteraccionCarrousel(event:any,nombre:string){
    if(event.source!='timer'){
      this._HelperServiceP.enviarMsjAcciones({Tag:'Carousel',Nombre:nombre,Accion:event.source})
    }
  }
  EventoInteraccionLinck(nombre:string,tipo:string){
    this._HelperServiceP.enviarMsjAcciones({Tag:'Link',Tipo:tipo,Nombre:nombre,Programa:this.cabecera.tituloHtml})
  }

  addPlayer() {
    var s = document.createElement('script');
    s.src =
      'https://players.brightcove.net/' +
      6267108632001 +
      '/default_default/index.min.js';
    document.body.appendChild(s);
  }
  VistaPreviaProgramaPortal(){
    this.VistaPreviaPortal='https://players.brightcove.net/6267108632001/rEr9tuuTvS_default/index.html?videoId=';
    if(this.esPadre){
      this._ProgramaService.VistaPreviaProgramaPadrePortal(this.PrimerCurso).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          if(x!=undefined || x!=null){
            if(x.videoIdBrightcove==undefined || x.videoIdBrightcove ==null ||x.videoIdBrightcove=='' ||x.videoIdBrightcove=='0'){
              this.ExisteVideo=false;
            }
            else{
              this.ExisteVideo=true;
              this.VistaPreviaPortal=this.VistaPreviaPortal+x.videoIdBrightcove
              this.idBr=x.videoIdBrightcove
            }
          }
        },
      })
    }
    else{
      this._ProgramaService.VistaPreviaProgramaPortal(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          if(x!=undefined || x!=null){
            if(x.videoIdBrightcove==undefined || x.videoIdBrightcove ==null ||x.videoIdBrightcove=='' ||x.videoIdBrightcove=='0'){
              this.ExisteVideo=false;
            }
            else{
              this.ExisteVideo=true;
              this.VistaPreviaPortal=this.VistaPreviaPortal+x.videoIdBrightcove
            }
          }
        },
      })
    }
    console.log(this. VistaPreviaPortal)
  }
  obtenerErrorPagoModal(){
    var ModalReintento = this._SessionStorageService.SessionGetValue('urlRedireccionErrorPagoModal');
    if(ModalReintento!=''){
      var abrirModalReintento = JSON.parse(ModalReintento);
      console.log(abrirModalReintento)
      if(abrirModalReintento==true){
        console.log('hola')
        this.OpenModalPago();
      }
      this._SessionStorageService.SessionDeleteValue('urlRedireccionErrorPagoModal')
    }
  }
}
