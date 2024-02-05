import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PagoOrganicoAlumnoDTO, RegistroPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO, RegistroProcesoPagoPseDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { CronogramaPagoService } from 'src/app/Core/Shared/Services/CronogramaPago/cronograma-pago.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { listaCertificacionDTO, listaMontoPagoProgramaInformacionDTO, listaPrerrequisitoDTO, listaSeccionPrograma, programaCabeceraDetalleDTO } from 'src/app/Core/Models/SeccionProgramaDTO';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { ProgramaService } from 'src/app/Core/Shared/Services/Programa/programa.service';
import { estructuraCursoDTO } from 'src/app/Core/Models/EstructuraProgramaDTO';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { BeneficiosDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { TagService } from 'src/app/Core/Shared/Services/Tag/tag.service';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';
import { listaExpositorDTO } from 'src/app/Core/Models/listaExpositorDTO';
import { ExpositorService } from 'src/app/Core/Shared/Services/Expositor/expositor.service';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import { environment } from 'src/environments/environment';



declare var OpenPay: any;
@Component({
  selector: 'app-tarjeta2',
  templateUrl: './tarjeta2.component.html',
  styleUrls: ['./tarjeta2.component.scss']
})
export class Tarjeta2Component implements OnInit {
  public urlBase=environment.url_api+'FormaPago';
  @ViewChild('contenidoTOp')
  contenidoTOp!: ElementRef;
  @ViewChild('contentLeft')
  contentLeft!: ElementRef;
  private signal$ = new Subject();
  constructor(
    private _router: Router,

    private _BeneficioService: BeneficioService,
    private _HelperService: HelperService,
    private _ActivatedRoute:ActivatedRoute,
    public _FormaPagoService:FormaPagoService,
    private _ProgramaService: ProgramaService,
    public dialog: MatDialog,
    private _CronogramaPagoService:CronogramaPagoService,
    private _MedioPagoActivoPasarelaService:MedioPagoActivoPasarelaService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _t:ImagenTarjetas,
    private _TagService: TagService,
    private _SilaboService: SilaboService,
    private _ExpositorService: ExpositorService,
    private activatedRoute: ActivatedRoute,
    private _SessionStorageService:SessionStorageService,
    private _SeccionProgramaService:SeccionProgramaService,
    private _SeoService:SeoService,

    private title:Title,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
   }
   public idBr=''
   public beneficios: Array<BeneficiosDTO> = [];
  isBrowser: boolean;
  public certificadoVacio=false;
    public estructuraPrograma: Array<estructuraCursoDTO> = [];
  public oncharge=false
  public tarjetas:any;
  public textoBienvenido = '';
  public CronogramaPago:any
  public dialogRef:any
  public email=""
  public seccionStep = 2;
  public idPais=0
  public IdPespecificoPrograma=0;
  public contenidoCabecera = '';
  public idPasarela:number=0
  public idAlumno:any=0
  public jsonSend:RegistroPreProcesoPagoDTO={
    IdFormaPago:0,
    IdMatriculaCabecera:0,
    IdPasarelaPago:0,
    IdPGeneral:0,
    ListaCuota:[],
    MedioCodigo:'',
    MedioPago:'',
    Moneda:'',
    SimboloMoneda:'',
    WebMoneda:'',
  }
  public PrerrequisitosPiePagina = '';
  public porcentajeDescuento='';
  public textoDescuento='';
  public codigoIso:string = 'INTC';
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

  public PrimerCurso='';
  public idPEspecifico=0
  public total=0;
  public validadorPagosMultiples:any;
  public migaPan = [
    {
      titulo: 'Mis pagos',
      urlWeb: '/AulaVirtual/MisPagos',
    }
  ];
  public prerequisitos: listaPrerrequisitoDTO = {
    cabecera: '',
    contenido: [],
    piePagina: '',
  };
  public CertificacionPiePagina = '';

  public EstadoAfiliado:any;
  public medioPagoSeleccionado:any;
  public eventosPagoSelccion:boolean = false;
  busquedadata:any
  public stepExpositors: Array<Array<listaExpositorDTO>> = [];
  busquedadataDes:any
  datospago:any
  datospagoDes:any
  public idFormaPago=-1
  public formapago:any;
  public programasRelacionados: Array<CardProgramasDTO> = [];
  public expositor: Array<listaExpositorDTO> = [];
  public esAonline=false
  public registroPse:RegistroProcesoPagoPseDTO={
    BancoPSE:'',
    NombreTitularPSE:'',
    NumeroDocumentoPSE:'',
    TelefonoTitularPSE:'',
    TipoClientePSE:'',
    TipoDocumentoPSE:'',
  }
  public certificado: listaCertificacionDTO = {
    cabecera: '',
    contenido: [],
    piePagina: '',
    descripcion: '',
    descripcionBody: [],
    descripcionHeader: [],
    descripcionLeyenda: '',
  };
  public idPegeneral = 0;
  public esPadre=false;

  public VistaPreviaPortal='';

  public MontoPago: Array<listaMontoPagoProgramaInformacionDTO> = [];
  public tags: Array<listaTagDTO> = [];
  public jsonSave: RegistroProcesoPagoAlumnoDTO = {
    IdentificadorTransaccion: '',
    MedioCodigo: '',
    MedioPago: '',
    RequiereDatosTarjeta: true,
    TransactionToken: '',
    Estado: null,
    Comprobante: false,
    CodigoTributario: '',
    RazonSocial: '',
    IdPasarelaPago: 0,
    IdentificadorUsuario: '',
    PagoPSE:false,
    TarjetaHabiente: {
      Aniho: '',
      CodigoVV: '',
      Mes: '',
      NumeroDocumento: '',
      NumeroTarjeta: '',
      Titular: '',
      fecha: '',
    },
  };
  public json: RegistroRespuestaPreProcesoPagoDTO = {
    IdentificadorTransaccion: '',
    RequiereDatosTarjeta: true,
  };
  public EstructuraPiePagina = '';
  public vistaPrevia = '';
  public resultCard: any = {
    nombrePrograma:'',
    version:'',
    tipo:1,
    moneda:'',
    montoTotal:0,
    inicio:''

  };
  public BeneficiosPiePagina = '';
  public NumberT = '';
  public rutaProgramaDetalle:any;
  public AraCompleta = '';
  public area = '';
  public namePrograma:any;
  public nombreProgramCompeto = '';
  public idBusqueda = 0;

  public seccion: listaSeccionPrograma = {
    duracionHorario: '',
    metodologiaOnline: '',
    objetivo: '',
    publicoObjetivo: '',
    video: '',
    vistaPrevia: '',
  };
  dataRuta:any
    public ExisteVideo=false;
  ngOnInit(): void {
    this.dataRuta = localStorage.getItem('dataRuta');
    this.dataRuta = atob(this.dataRuta)
    this.dataRuta =JSON.parse(this.dataRuta);

    this.rutaProgramaDetalle=this.dataRuta
    this.area = this.dataRuta.area
    this.AraCompleta = this.dataRuta.AraCompleta
    this.nombreProgramCompeto = this.dataRuta.nombreProgramCompeto
    this.namePrograma = this.dataRuta.namePrograma
    console.log(this.namePrograma)
    this.idBusqueda = parseInt(this.namePrograma[this.namePrograma.length - 1]);
if(this.namePrograma == undefined){
    this._router.navigate(['error404']);
}
this.EstructuraProgramaPortal();


    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        //this.idMatricula = parseInt(x['IdMatricula']);
        this.json.IdentificadorTransaccion = x['Identificador'];
        var r = this._SessionStorageService.SessionGetValue(
          this.json.IdentificadorTransaccion
        );
        if (r != '') {
          this.json.RequiereDatosTarjeta = true
          //= r == 'false' ? false : true;
          //this._SessionStorageService.SessionDeleteValue(this.json.IdentificadorTransaccion);
        }

      },
    });

    // this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
    //   next: (x) => {
    //     console.log(x)
    //     this.rutaProgramaDetalle=x
    //     this.area = x['AreaCapacitacion'].split('-').join(' ');
    //     this.AraCompleta = x['AreaCapacitacion'];
    //     this.nombreProgramCompeto = x['ProgramaNombre'];
    //     this.namePrograma = x['ProgramaNombre'].split('-');
    //     console.log(this.namePrograma)
    //     this.idBusqueda = parseInt(this.namePrograma[this.namePrograma.length - 1]);


    //   },
    //   error: () => {
    //     this._router.navigate(['error404']);
    //   },
    // });

    this.busquedadata = localStorage.getItem('Busqueda');
    this.busquedadata = atob(this.busquedadata)
    this.busquedadata =JSON.parse(this.busquedadata)

    this.datospago = localStorage.getItem('datEnvioPago');
    this.datospago = atob(this.datospago)
    this.datospago =JSON.parse(this.datospago);
    console.log(this.busquedadata,'entro')
    let i=0
    this.ListMontoPagoCompleto()
    this.modalidad = this.datospago.modalidad

    this.MedioPagoActivoPasarelaPortal();
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
    IdBusqueda:0
  }
  //evento data pago
  jsonPreproceaminetoData:any
  ObtenerPreProcesoPagoOrganicoAlumno() {
    var formaPago=this.formapago[this.idFormaPago];

    var pEspecifico:any;
    this.modalidad.forEach((e:any) => {
      if(e.id==this.idPEspecifico){
        pEspecifico=e;
      }
    });

    var find=this.tarjetas.find((x:any)=>x.medioCodigo=='VS')
    find.idPEspecifico=this.idPEspecifico;
    find.moneda=formaPago.simbolo
    find.webMoneda=formaPago.webMoneda
    if(formaPago.idTipoPago==1){
      find.montoTotal= formaPago.cuotas
    }else{
      find.montoTotal= formaPago.matricula
    }
    find.version=null
    if(formaPago.paquete==1){
      find.version='Versión basica'
    }
    if(formaPago.paquete==2){
      find.version='Versión profesional'
    }
    if(formaPago.paquete==3){
      find.version='Versión gerencial'
    }
    // find.tipo=''
    // find.inicio=''
    find.tipo=pEspecifico.tipo,
    find.inicio=pEspecifico.fechaInicioTexto



    this.jsonEnvioPago.IdFormaPago=find.idFormaPago;
    //this.jsonEnvioPago.IdMontoPago=;
    this.jsonEnvioPago.IdPEspecifico=find.idPEspecifico;
    this.jsonEnvioPago.IdPGeneral=this.idPegeneral;
    this.jsonEnvioPago.IdPais=this.idPais;
    this.jsonEnvioPago.IdPasarelaPago=find.idPasarelaPago.toString();
    this.jsonEnvioPago.MedioCodigo=find.medioCodigo;;
    this.jsonEnvioPago.MedioPago=find.medioPago;
    this.jsonEnvioPago.Moneda=find.moneda;
    this.jsonEnvioPago.MontoTotalPago=find.montoTotal;
    this.jsonEnvioPago.Inicio=find.inicio;
    this.jsonEnvioPago.Version=find.version;
    this.jsonEnvioPago.Tipo=find.tipo;
    this.jsonEnvioPago.IdBusqueda=this.idBusqueda
    //this.jsonEnvioPago.TipoProveedor=;
    this.jsonEnvioPago.WebMoneda=find.webMoneda;

   // this.pagoOrganicoDatos(find)

////////

    // aqui hacer el preprocesamiento y setear a this.json


    this._FormaPagoService.PagoOrganicoDatosServicio(this.jsonEnvioPago) //PagoOrganicoAlumnoDTO
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {

          console.log('resultcard',x)

          this.jsonPreproceaminetoData =
          {
            identificadorTransaccion: x._Repuesta.identificadorTransaccion,
            requiereDatosTarjeta: x._Repuesta.requiereDatosTarjeta
          }


          this._FormaPagoService.ObtenerPreProcesoPagoOrganicoAlumno(this.jsonPreproceaminetoData)
          .pipe(takeUntil(this.signal$))
          .subscribe({
            next: (x) => {
              this.resultCard = x._Repuesta;
              this.resultCard.total = 0;
              this.jsonSave.IdentificadorTransaccion =
                this.resultCard.identificadorTransaccion;
              this.jsonSave.MedioCodigo = this.resultCard.medioCodigo;
              this.jsonSave.MedioPago = this.resultCard.medioPago;
              this.jsonSave.RequiereDatosTarjeta = this.json.RequiereDatosTarjeta;
              // this.jsonSave.CodigoTributario = this.resultCard.identificadorTransaccion;
              // this.jsonSave.RazonSocial = this.resultCard.identificadorTransaccion;
              this.jsonSave.IdPasarelaPago = this.resultCard.idPasarelaPago;
              this.jsonSave.IdentificadorUsuario=this._SessionStorageService.SessionGetValue('usuarioWeb');

              this.jsonSave.PagoPSE=(this.resultCard.idPasarelaPago!=1 || this.resultCard.idFormaPago!=65)?false:true;
              if (this.resultCard.idPasarelaPago == 5) {
                this.OpenPayInit();
              }
            },
          });



        },
      });



  }

JsonData:any
sesionPreprocesamiento:any
  pagoOrganicoDatos(Json:PagoOrganicoAlumnoDTO){
    console.log(Json)

    this._FormaPagoService.PagoOrganicoDatosServicio(Json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log('pagoOrganicoDatos',x)
        this.sesionPreprocesamiento = x._Repuesta.identificadorTransaccion
      }
    })
      console.log(Json)

    }

  OpenPayInit() {

    OpenPay.setId('mxgmgffnaxu1mosrkhlo');
    OpenPay.setApiKey('pk_c9dfff7c5c9e4a68a7c6083d280ff4db');
    //OpenPay.setSandboxMode(false);
    OpenPay.setSandboxMode(false);
    //Se genera el id de dispositivo
    var deviceSessionId = OpenPay.deviceData.setup('fomrOpenPAy');
    this.jsonSave.DeviceSessionId = deviceSessionId;
  }

  ListMontoPagoCompleto(){
    this._SeccionProgramaService.ListMontoPagoCompleto(this.busquedadata.IdBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.formapago=x.listaMontoPagoProgramaInformacionDTO

        console.log('forma!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1',this.formapago)
       // this. Pagar()
      }
    })
  }
///llamada evento despues de hacer click
  EventoInteraccionSelectClick(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Select',Nombre:nombre,Tipo:'Click'})
    // if(this.medioPagoSeleccionado == undefined && this.idFormaPago == -1  ){
    //   this.ObtenerPreProcesoPagoOrganicoAlumno();
    // }
  }
  EventoInteraccionSelect(nombre:string,valor:string){
    this._HelperService.enviarMsjAcciones({Tag:'Select',Nombre:nombre,Tipo:'Select',Valor:valor})
    // if(this.medioPagoSeleccionado == undefined  && this.idPEspecifico == 0 ){
    //   this.ObtenerPreProcesoPagoOrganicoAlumno();
    // }
  }
  onChangeRadioButton(event:any){
    this.medioPagoSeleccionado=event;
   //
    if( this.medioPagoSeleccionado != undefined && this.idFormaPago != -1 && this.idPEspecifico != 0 ){
      this.ObtenerPreProcesoPagoOrganicoAlumno();
    }
  }

  changeForma(){
    var fp=this.formapago[0]

    var value=''
    if(fp.paquete==1){
      value='Versión Basica,'
    }
    if(fp.paquete==2){
      value='Versión Profesional,'
    }
    if(fp.paquete==3){
      value='Versión Gerencial,'
    }
    if(fp.idTipoPago==1){
      value+='al Contado: '+fp.simbolo+' '+fp.cuotas
    }
    if(fp.idTipoPago==2){
      value+='pago en 1 matricula de'+
      fp.simbolo+' '+fp.matricula+
      ' y '+fp.nroCuotas+' cuotas mensuales de '+fp.simbolo+' '+fp.cuotas
    }
    this.EventoInteraccionSelect('Selecciona tu forma de pago',value)
    if( this.medioPagoSeleccionado != undefined && this.idFormaPago != -1 && this.idPEspecifico != 0 ){
      this.ObtenerPreProcesoPagoOrganicoAlumno();
    }
  }
  changeModalidad(){
    if( this.medioPagoSeleccionado != undefined && this.idFormaPago != -1 && this.idPEspecifico != 0 ){
      this.ObtenerPreProcesoPagoOrganicoAlumno();
    }
  }

  ValidateSave() {
    var succes=(res:any) =>{
      this.jsonSave.TokenId=res.data.id
      this.Pagar();

    }
    var error=(err:any) =>{

      this._SnackBarServiceService.openSnackBar(
        'Los datos de tarjeta ingresados son incorrectos',
        'x',
        5,
        'snackbarCrucigramaerror'
      );

    }
    var validate = true;
    if(this.resultCard.idPasarelaPago!=1 || this.resultCard.idFormaPago!=65){
      if (this.jsonSave.TarjetaHabiente.CodigoVV.length < 3) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Numero CVV Incorrecto',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if (this.jsonSave.TarjetaHabiente.fecha.length < 5) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Fecha de vencimiento incorrecta',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if (!this.NumberT.startsWith('37') && this.NumberT.split('-').join('').length < 14) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Numero de tarjeta Incorrecta',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if (this.NumberT.startsWith('34') && this.NumberT.split('-').join('').length < 14) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Numero de tarjeta Incorrecta',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
    }else{
      if(this.registroPse.TipoDocumentoPSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Ingrese su tipo de documento',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if(this.registroPse.TipoClientePSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Ingrese el tipo de cliente',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if(this.registroPse.TelefonoTitularPSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Ingrese su numero celular',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if(this.registroPse.BancoPSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Seleccione su banco',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
    }
    if(this.jsonSave.TarjetaHabiente.Titular==''){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese los nombres del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
    if(this.jsonSave.TarjetaHabiente.NumeroDocumento==null || this.jsonSave.TarjetaHabiente.NumeroDocumento.length<=5){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese el documento completo del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
    if (validate) {

      this.jsonSave.TarjetaHabiente.NumeroTarjeta =this.NumberT.split('-').join('');
      this.jsonSave.TarjetaHabiente.Aniho =this.jsonSave.TarjetaHabiente.fecha.split('/')[1];
      this.jsonSave.TarjetaHabiente.Mes =this.jsonSave.TarjetaHabiente.fecha.split('/')[0];
      if (this.jsonSave.IdPasarelaPago == 5) {
        OpenPay.token.create(
          {
            card_number: this.jsonSave.TarjetaHabiente.NumeroTarjeta,
            holder_name: this.jsonSave.TarjetaHabiente.Titular,
            expiration_year: this.jsonSave.TarjetaHabiente.Aniho,
            expiration_month: this.jsonSave.TarjetaHabiente.Mes,
            cvv2: this.jsonSave.TarjetaHabiente.CodigoVV,
          },
          succes,
          error
        );
      } else {
        if(this.oncharge==false){
          this.Pagar();
        }
      }
    }
  }



  Pagar() {
    this.oncharge=true
    const dialogRef =this.dialog.open(ChargeTextComponent,{
      panelClass:'dialog-charge-text',
      data: { text: 'Procesando pago' },
      disableClose:true
    });
    this.registroPse.NombreTitularPSE=this.jsonSave.TarjetaHabiente.Titular;
    this.registroPse.NumeroDocumentoPSE=this.jsonSave.TarjetaHabiente.NumeroDocumento;
    this.jsonSave.RegistroProcesoPagoPse=this.registroPse;
    this._FormaPagoService.ProcesarPagoAlumnoOrganico(this.jsonSave).pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this.oncharge=false
          dialogRef.close()
          if(this.resultCard.idPasarelaPago!=1 || this.resultCard.idFormaPago!=65){
            if(this.resultCard.idPasarelaPago!=5){
              this._router.navigate(['/AulaVirtual/PagoExitoso/' +this.jsonSave.IdentificadorTransaccion]);
            }else{
              location.href=x._Repuesta.urlRedireccionar;
            }
          }else{
            location.href=x._Repuesta.urlRedireccionar;
          }
        },
        error:e=>{
          this.oncharge=false
          dialogRef.close()
        },
        complete:()=>{
          this.oncharge=false
          dialogRef.close()
        }
      });
      //this.ObtenerCabeceraProgramaGeneral();
  }


  ObtenerCabeceraProgramaGeneral() {
    this._SeccionProgramaService
      .ObtenerCabeceraProgramaGeneral(this.busquedadata).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x.programaCabeceraDetalleDTO.direccion==this.namePrograma.join('-'))
          if(x.programaCabeceraDetalleDTO!=undefined
            && this.removeAccents(this.area.toLowerCase())==this.removeAccents(x.programaCabeceraDetalleDTO.areaCapacitacion.toLowerCase())
            && x.programaCabeceraDetalleDTO.direccion==this.namePrograma.join('-')
            )
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
            console.log(this.contentLeft.nativeElement.offsetHeight)
            console.log(this.contenidoTOp.nativeElement.offsetHeight)
            setTimeout(() => {

              console.log("--------------")
              console.log(this.contentLeft.nativeElement.offsetHeight)
              console.log(this.contenidoTOp.nativeElement.offsetHeight)
              if(this.contenidoTOp.nativeElement.offsetHeight>360){
                var min=this.contentLeft.nativeElement.offsetHeight*1+((this.contenidoTOp.nativeElement.offsetHeight-360)*2)
                console.log(min)
                this.contentLeft.nativeElement.setAttribute('style', 'min-height:'+min+'px')
              }
              console.log("--------------")
            }, 500);

            this.ListMontoPago();
            this.ListSeccionPrograma();
            if (this.isBrowser) {
              this.ListPrerrequisito();
             // this.EstructuraProgramaPortal();
              this.ListBeneficioPrograma();
              this.ListCertificacion();
              this.ListExpositor();
              this.ListTagProgramaRelacionadoPorIdBusqueda();
              this.obtenerErrorPagoModal();
            }
          }
          else{
            console.log('/'+this.removeAccents(x.programaCabeceraDetalleDTO.areaDescripcion)+'/'+x.programaCabeceraDetalleDTO.direccion)
            window.location.replace('/'+this.removeAccents(x.programaCabeceraDetalleDTO.areaDescripcion)+'/'+x.programaCabeceraDetalleDTO.direccion);
           // this._router.navigate(['/'+this.removeAccents(x.programaCabeceraDetalleDTO.areaCapacitacion)+'/'+x.programaCabeceraDetalleDTO.direccion]);
          }
        },
        error: (e) => {
          this._router.navigate(['error404']);
        },
      });
      this.modalidad = this.cabecera.listProgramaEspecificoInformacionDTO
  }
  modalidad:any
  removeAccents(strng:string){
    return strng.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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

  obtenerErrorPagoModal(){
    var ModalReintento = this._SessionStorageService.SessionGetValue('urlRedireccionErrorPagoModal');
    if(ModalReintento!=''){
      var abrirModalReintento = JSON.parse(ModalReintento);
      console.log(abrirModalReintento)
      if(abrirModalReintento==true){
        console.log('hola')
        //this.OpenModalPago();
      }
      this._SessionStorageService.SessionDeleteValue('urlRedireccionErrorPagoModal')
    }
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
  // OpenModalPago(){
  //   this.codigoIso =
  //     this._SessionStorageService.SessionGetValue('ISO_PAIS') != ''
  //       ? this._SessionStorageService.SessionGetValue('ISO_PAIS')
  //       : 'INTC';
  //   this.IdPais=this.GetIdPaisProCodigo();
  //   let dataEnvioPago = {
  //     idPais: this.IdPais ,
  //       idBusqueda:this.idBusqueda,
  //       alumno:this.alumno,
  //       nombre:this.cabecera.nombre,
  //       modalidad:this.cabecera.listProgramaEspecificoInformacionDTO,
  //       rutaProgramaDetalle:this.rutaProgramaDetalle
  //   }
  //   this._SessionStorageService.SessionSetValue('datEnvioPago',JSON.stringify(dataEnvioPago));
  //   const dialogRef = this.dialog.open(ProgramaPagoComponent, {
  //     width: '900px',
  //     data: {
  //       idPais: this.IdPais ,
  //       idBusqueda:this.idBusqueda,
  //       alumno:this.alumno,
  //       nombre:this.cabecera.nombre,
  //       modalidad:this.cabecera.listProgramaEspecificoInformacionDTO,
  //       rutaProgramaDetalle:this.rutaProgramaDetalle},
  //     panelClass: 'programa-pago-dialog-container',
  //   });
  //   dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
  //     if(result!=undefined){

  //      // this.PreProcesoPagoOrganicoAlumno(result);
  //     }
  //   });
  // }

  MedioPagoActivoPasarelaPortal(){
    this._MedioPagoActivoPasarelaService.MedioPagoActivoPasarelaPortal(this.idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.validadorPagosMultiples = x.filter((item:any) => item.idPasarelaPago === 7 || item.idPasarelaPago === 18 || item.idPasarelaPago === 10);
        this.tarjetas=x
        this.tarjetas.forEach((e:any) => {
          e.img=this._t.GetTarjeta(e.medioCodigo)
        });
        //this.ListMontoPagoCompleto();
      }
    })
  }
}
