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
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
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
  };
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

  ngOnInit(): void {
    if (this.isBrowser) {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 992) this.seccionStep = 2;
      if (this.innerWidth < 768) this.seccionStep = 1;
    }
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.area = x['AreaCapacitacion'].split('-').join(' ');
        console.log('Area----------'+this.area)
        this.AraCompleta = x['AreaCapacitacion'];
        console.log('AraCompleta----------'+this.AraCompleta)
        this.nombreProgramCompeto = x['ProgramaNombre'];
        console.log(this.nombreProgramCompeto)
        var namePrograma = x['ProgramaNombre'].split('-');
        console.log(namePrograma)

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

    this._HelperServiceP.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.alumno =x.datosAlumno.nombres;
      this.combosPrevios=x.datosAlumno;
      console.log(this.combosPrevios)
      this.formularioContacto.Nombres= this.combosPrevios.nombres,
      this.formularioContacto.Apellidos= this.combosPrevios.apellidos,
      this.formularioContacto.Email= this.combosPrevios.email,
      this.formularioContacto.IdPais= this.combosPrevios.idPais,
      this.formularioContacto.IdRegion= this.combosPrevios.idDepartamento,
      this.formularioContacto.Movil= this.combosPrevios.telefono
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
    })

    this.AddFields();
    this.ObtenerCombosPortal();
    this.ObtenerCabeceraProgramaGeneral();
  }

  RegistrarProgramaPrueba(){
    this._AccountService.RegistroCursoAulaVirtualNueva(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this._router.navigate(['/AulaVirtual/MisCursos']);
      },
    })
  }

  OpenModal(): void {
    const dialogRef = this.dialog.open(VistaPreviaComponent, {
      width: '500px',
      data: { url: this.vistaPrevia },
      panelClass: 'custom-dialog-container',
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
        modalidad:this.cabecera.listProgramaEspecificoInformacionDTO},
      panelClass: 'programa-pago-dialog-container',
    });
    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
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
          console.log(x);
          console.log(x.programaCabeceraDetalleDTO)
          console.log(this.area);
          console.log(x.programaCabeceraDetalleDTO.areaCapacitacion);
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
              console.log(t)
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
            this.IdPespecificoPrograma = x.programaCabeceraDetalleDTO.listProgramaEspecificoInformacionDTO[0].id
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
            this.ListSeccionPrograma();
            this.ListPrerrequisito();
            this.EstructuraProgramaPortal();
            this.ListBeneficioPrograma();
            this.ListCertificacion();
            this.ListExpositor();
            this.ListMontoPago();
            this.ListTagProgramaRelacionadoPorIdBusqueda();
          }
          else{
            this._router.navigate(['error404']);

          }
        },
        error: (e) => {
          console.log(e)
          this._router.navigate(['error404']);
        },
      });

  }
  ListSeccionPrograma() {
    this._SeccionProgramaService
      .ListSeccionPrograma(this.idBusqueda).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
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
          console.log(this.seccion)
        },
      });
  }

  ListPrerrequisito() {
    this._SeccionProgramaService.ListPrerrequisito(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.prerequisitos = x.listaPrerrequisitoDTO;
      },
    });
  }
  EstructuraProgramaPortal() {
    this._ProgramaService.EstructuraProgramaPortal(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.estructuraPrograma = x.estructuraCurso;
        this.estructuraPrograma.map((x) => {
          if (this.estructuraPrograma.length > 3) {
            x.opened = false;
          } else {
            x.opened = true;
          }
        });
        console.log(this.estructuraPrograma);
        this.idPegeneral = x.idPGeneral;
        this.ObtenerSilaboCurso();
        this.ListProgramaRelacionado();
        //this.prerequisitos=x.listaPrerrequisitoDTO;
      },
    });
  }
  ListBeneficioPrograma() {
    this._BeneficioService.ListBeneficioPrograma(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        this.beneficios = x.listaBeneficioProgramaDTO;
        let i = 1;
        var beneficioLista: Array<number> = [];
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
      },
    });
  }
  ObtenerSilaboCurso() {
    this._SilaboService.ObtenerSilaboCurso(this.idPegeneral).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
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
        console.log(x);
        this.certificado = x.listaCertificacionDTO;
        if (this.certificado.descripcion != null) {
          var descstrong = this.certificado.descripcion.split('<p><strong>');
          var desc = [];
          this.certificado.descripcionHeader=[]
          this.certificado.descripcionBody=[]
          this.certificado.descripcionLeyenda = descstrong[0];

          console.log(descstrong);
          if (descstrong.length > 1) {
            let i = 0;
            descstrong.forEach((d) => {
              if (i != 0) {
                desc = d.split('</strong></p>');
                console.log(desc)
                if (desc.length > 1 && desc[1]!='') {
                  let j = 0;
                  this.certificado.descripcionHeader.push('<p><strong>' + desc[0] );
                  let dc = '';
                  desc.forEach((d2) => {
                    if (j != 0) {
                      dc += d2 + '</strong></p>';
                    }
                    j++;
                  });
                  this.certificado.descripcionBody.push(dc);
                }else{
                  this.certificado.descripcionLeyenda+='<br><strong>'+desc[0]+'<strong>';
                }
              }
              i++;
            });
            console.log(this.certificado);
            // this.certificado.descripcionHeader=desc[0]+'</strong></p>'
            // let i=0;
            // this.certificado.descripcionBody='';
            // desc.forEach(d=>{
            //   if(i!=0){
            //     this.certificado.descripcionBody+=d+'</strong></p>'
            //   }
            //   i++;
            // })
          }
        }
      },
    });
  }
  ListExpositor() {
    this._ExpositorService.ListExpositor(this.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
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
        console.log(x);
        this.MontoPago = x.listaMontoPagoProgramaInformacionDTO;
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
          console.log(x);
          if (x.listaProgramaRelacionadoDTO != null) {
            this.programasRelacionados = x.listaProgramaRelacionadoDTO.map(
              (c: any) => {
                var urlArea = c.areaCapacitacion.replace(/\s+/g, '-');
                var urlSubArea = c.nombre.split(' - ').join('-');
                var urlSubArea = urlSubArea.replace(/\s+/g, '-');
                var ps: CardProgramasDTO = {
                  Inversion: c.montoPagoDescripcion,
                  Content: c.descripcion,
                  Url: '/' + urlArea + '/' + urlSubArea + '-' + c.idBusqueda,
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
          console.log(x);
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
  SetContacto(value: any) {
    if (!this.formVal) {
      this._SnackBarServiceService.openSnackBar(
        'Debes completar todos los campos',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
    } else {
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
      this.DatosEnvioFormulario.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);
      if(IdPEspecifico==''){
        this.DatosEnvioFormulario.IdPespecifico=this.IdPespecificoPrograma;
      }else{
        this.DatosEnvioFormulario.IdPespecifico=parseInt(IdPEspecifico)
      };
      this._HelperService
        .EnviarFormulario(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            console.log(x);
            if(this.isBrowser){
              console.log('------------------facebook(true)---------------------------');
              console.log(fbq);
              fbq('track', 'CompleteRegistration');
              gtag('event', 'conversion', {
                'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
              });
              gtag('event', 'conversion', {
                  'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
              });
            }
            this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
          },
          complete: () => {
            //this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
            this.statuscharge = false;
          },
        });
    }
  }
  ObtenerCombosPortal() {
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdPais') {
            r.data = x.listaPais.map((p: any) => {
              var ps: Basic = { Nombre: p.pais, value: p.idPais };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdCargo') {
            r.data = x.listaCargo.map((p: any) => {
              var ps: Basic = { Nombre: p.cargo, value: p.idCargo };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdAreaFormacion') {
            r.data = x.listaAreaFormacion.map((p: any) => {
              var ps: Basic = {
                Nombre: p.areaFormacion,
                value: p.idAreaFormacion,
              };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdAreaTrabajo') {
            r.data = x.listaAreaTrabajo.map((p: any) => {
              var ps: Basic = { Nombre: p.areaTrabajo, value: p.idAreaTrabajo };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdIndustria') {
            r.data = x.listaIndustria.map((p: any) => {
              var ps: Basic = { Nombre: p.industria, value: p.idIndustria };
              return ps;
            });
          }
        });
      },
    });
    this.initValues = true;
  }
  GetRegionesPorPais(idPais: number) {
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdRegion') {
            r.disable = false;
            r.data = x.map((p: any) => {
              var ps: Basic = { Nombre: p.nombreCiudad, value: p.idCiudad };
              return ps;
            });
          }
        });
        this.form.enablefield('IdRegion');
      },
    });
  }
  SelectChage(e: any) {
    if (e.Nombre == 'IdPais') {
      this.GetRegionesPorPais(e.value);
    }
  }
  AddFields() {
    this.fileds.push({
      nombre: 'Nombres',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Nombres',
    });
    this.fileds.push({
      nombre: 'Apellidos',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Apellidos',
    });
    this.fileds.push({
      nombre: 'Email',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required, Validators.email],
      label: 'E-mail',
    });
    this.fileds.push({
      nombre: 'IdPais',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'País',
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
      nombre: 'Movil',
      tipo: 'phone',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Teléfono Móvil',
    });
  }
  LimpiarCampos(){
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
    console.log('------------'+estado)
    this.cargaChat=estado
  }
}
