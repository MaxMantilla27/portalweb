import { DOCUMENT, isPlatformBrowser, DatePipe } from '@angular/common';
import {
  Component,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatBotAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import {
  ActualizarAlumnoChatBotDTO,
  FlujoChatEntradalDTO,
  InicioEntradaChatbotDTO,
  PerfilProfesionalDTO,
  ValidacionChatBotEnvioDTO,
} from 'src/app/Core/Models/ChatBotDTO';
import { ChatBotService } from 'src/app/Core/Shared/Services/ChatBot/chat-bot.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { MovilValidator } from 'src/app/Core/Shared/Validators/MovilValidator';
import { Router } from '@angular/router';
import { ViewChildren, QueryList, AfterViewInit } from '@angular/core';

interface ITrueFalse {
  id: number;
  nombre: string;
  idCampo: number;
  campo: string;
  Check: boolean;
  validacion: boolean;
}
@Component({
  selector: 'app-chat-bot-landing-page',
  templateUrl: './chat-bot-landing-page.component.html',
  styleUrls: ['./chat-bot-landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatBotLandingPageComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild('scrollContainer') scrollContainer: any;
  @ViewChildren('inputElementRef') inputElements: any;
  @ViewChildren('inputElements') inputChat: any;
  ngAfterViewInit() {
    //  console.log ( "input elements",this.inputElements )
    //  this.inputElements.nativeElement.querySelector('.inputElements').focus();
  }
  focusOnLastInput() {
    const lastInputElement = this.inputElements.last;

    if (lastInputElement) {
      // Focus on the last input element
      lastInputElement.nativeElement.focus();
    }
  }
  formControl = new FormControl('', [Validators.required]);
  private signal$ = new Subject();
  isBrowser: boolean;
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
    clearInterval(this.intervalInicio);
  }
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private _HelperService: HelperService,
    private _SessionStorageService: SessionStorageService,
    private _ChatBotService: ChatBotService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.urlPrograma = '/programas-certificaciones-cursos';
  }

  private validarTamanioVentana() {
    const width = window.innerWidth;

    if (width < 600) {
      console.log('Ventana pequeña');
      this.pantalla = true;
    } else {
      console.log('Ventana grande');
      this.pantalla = false;
    }
  }

  chat = false;
  pantalla = false;
  CargandoChat = false;
  public primerpaso: any;
  public SiguientesPasos: Array<any> = [];
  public pasoActual: any;
  public horaMinuto: any;

  public OportunidadDTO: ValidacionChatBotEnvioDTO = {
    NombresCompletos: '',
    Celular: '',
    Correo: '',
    IdCategoriaDato: 0,
    IdPespecifico: 0,
    IdPrograma: 0,
    IdCampania: 0,
    IdUsuario: '',
    IdPais: 51,
    IdAreaFormacion: 0,
    IdCargo: 0,
    IdAreaTrabajo: 0,
    IdIndustria: 0,
  };
  public datosAlumno: ChatBotAlumnoDTO = {
    Email: '',
    Movil: '',
    Nombres: '',
    IdAreaFormacion: 0,
    IdAreaTrabajo: 0,
    IdCargo: 0,
    IdIndustria: 0,
    IdPais: 51,
    IdRegion: 0,
    Id: 0,
  };
  public flujoActual: FlujoChatEntradalDTO = {
    CodigoPGeneral: '',
    IdCampoContacto: 0,
    IdChatbotUsuarioContacto: 0,
    IdConfiguracionFlujoChatbot: 1,
    NombrePGeneral: '',
    NombreUsuario: '',
    Paso: 0,
    UsuarioRegistrado: false,
    Caso: 'a',
    EsMensajeFinal: false,
    IdOportunidad: 0,
    IdAlumno: 0,
  };
  public ActualizarAlumnoDTO: ActualizarAlumnoChatBotDTO = {
    IdAlumno: 0,
    IdentificadorApi: '',
    Valor: '',
  };
  public datos: PerfilProfesionalDTO = {
    CodigoPGeneral: '',
    IdCampo: 0,
    IdCampoContacto: 0,
    PrimerBloque: true,
  };

  public dataInicial: InicioEntradaChatbotDTO = {
    IdContactoPortalSegmento:
      this._SessionStorageService.SessionGetValue('usuarioWeb'),
    IdFormulario: 556, //550//567
  };
  public Paises: any;
  public min = 0;
  public max = 1000;
  public intervalInicio: any;
  public opcionesTruFalse: Array<ITrueFalse> = [];
  public urlPrograma: string;
  public idBusqueda: any;
  public cargando = false;
  public datePipe = new DatePipe('en-US');
  public validacionCambio: boolean = false;
  public validacionCambioMovil: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    this.SetPaisCodigo();
    // this.inputElements.nativeElement.querySelector('.inputDataUsuario').focus();
  }
  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
  }

  ngOnInit(): void {
    this.validarTamanioVentana();
    this.validacionCambioMovil = false;
    this.horaMinuto = new Date();
    if (this.isBrowser) {
      this.intervalInicio = setInterval(() => {
        var usuarioWeb =
          this._SessionStorageService.SessionGetValue('usuarioWeb');
        console.log('usuario web', usuarioWeb);
        if (usuarioWeb != '' && usuarioWeb != null && usuarioWeb.length > 0) {
          this.dataInicial.IdContactoPortalSegmento = usuarioWeb;
          this.InicializarChatbot();
          clearInterval(this.intervalInicio);
        }
      }, 100);
    }
    this._HelperService.recibirDataPais
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('recibir pais', x);
          this.Paises = x;
          if (this.Paises != null && this.Paises != undefined) {
            //this.datosAlumno.Id==0
            this.SetPaisCodigo();
          }
        },
      });

    this._HelperService
      .recibirChangePais()
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('recibir cambio de pais', x);
          if (this.Paises != null && this.Paises != undefined) {
            //this.datosAlumno.Id==0
            this.SetPaisCodigo();
          }
        },
      });
  }
  InicializarChatbot() {
    this.CargandoChat = true;
    this._ChatBotService
      .InicializarChatbot(this.dataInicial)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('iniciar chatbot', x);
          if (x.datosFormulario != undefined && x.datosFormulario != null) {
            this.OportunidadDTO.IdCampania =
              x.datosFormulario.idConjuntoAnuncio;
            this.OportunidadDTO.IdPrograma = x.datosFormulario.idPGeneral;
            this.OportunidadDTO.IdPespecifico = x.datosFormulario.idPEspecifico;
            this.OportunidadDTO.IdCategoriaDato =
              x.datosFormulario.idCategoriaOrigen;
            this.idBusqueda = x.datosFormulario.idBusqueda;
          }
          if (x.datosAlumno != null) {
            this.datosAlumno.Id = x.datosAlumno.idAlumno;
            this.datosAlumno.Movil = x.datosAlumno.celular;
            this.datosAlumno.Email = x.datosAlumno.correo;
            this.datosAlumno.IdAreaFormacion = x.datosAlumno.idAreaFormacion;
            this.datosAlumno.IdAreaTrabajo = x.datosAlumno.idAreaTrabajo;
            this.datosAlumno.IdCargo = x.datosAlumno.idCargo;
            this.datosAlumno.IdIndustria = x.datosAlumno.idIndustria;
            this.datosAlumno.IdPais = x.datosAlumno.idPais;
            console.log('hay datosAlumno', this.datosAlumno.IdPais);
            this.datosAlumno.Nombres = x.datosAlumno.nombresCompletos;
            this.ActualizarAlumnoDTO.IdAlumno = x.datosAlumno.idAlumno;
          } else {
            var dataAlumnoLocal = this._SessionStorageService.SessionGetValue(
              'dataAlumnoChatBot' + this.OportunidadDTO.IdPrograma
            );
            if (dataAlumnoLocal != '' && dataAlumnoLocal != null) {
              this.datosAlumno = JSON.parse(dataAlumnoLocal);
            }
          }
          this.datosAlumno.IdPais == 0 ? (this.datosAlumno.IdPais = 51) : ''; // por defecto Pais Peru
          console.log('datos alumno inicializar', this.datosAlumno);
          this.flujoActual.IdChatbotUsuarioContacto =
            x.idChatbotUsuarioContacto;
          this.flujoActual.NombreUsuario = x.nombreUsuarioRegistrado;
          this.flujoActual.UsuarioRegistrado = x.registrado;
          this.flujoActual.CodigoPGeneral = x.datosFormulario.codigoPGeneral;
          this.flujoActual.NombrePGeneral = x.datosFormulario.nombrePGeneral;
          this.flujoActual.IdAlumno = x.idAlumno;
          this.flujoActual.IdOportunidad = x.idOportunidad;
          if (x.historial != null && x.historial.length > 0) {
            x.historial.forEach((h: any) => {
              var opcionesdesc = null;
              if (
                h.opcionEnviadoJson != undefined &&
                h.opcionEnviadoJson != null
              ) {
                opcionesdesc = JSON.parse(h.opcionEnviadoJson);
              }
              console.log('opciones', opcionesdesc);
              this.SiguientesPasos.push({
                idChatbotConfiguracionFlujo: 1,
                usuarioRegistrado: h.usuarioRegistrado,
                paso: h.paso,
                caso: h.caso,
                esMensajeFinal: false,
                mensaje: h.mensajeEnviado,
                nombreFuncion: h.nombreFuncion,
                mensajeErrorValidacion: h.mensajeErrorValidacion,
                idCampoContacto: h.idCampoContacto,
                identificadorApi: h.identificadorApi,
                opciones: opcionesdesc,
                respuesta: h.tipoOpcion == 'TrueFalse' ? null : h.respuesta,
                tipoOpcion: h.tipoOpcion,
                fechaRegistrada: this.datePipe.transform(
                  h.fechaCreacion,
                  'hh:mm a'
                ),
                validacionCambioMovil: false,
              });
              console.log('documents.get', this.ElementRefTemp);
            });
            console.log('siguientespasos', this.SiguientesPasos);
            var pasoActualHistotial = x.historial[x.historial.length - 1];
            this.CargandoChat = true;
            this.flujoActual.Paso = pasoActualHistotial.paso;
            this.flujoActual.Caso = pasoActualHistotial.caso;
            this.flujoActual.MensajeEnviado =
              pasoActualHistotial.mensajeEnviado;
            this.flujoActual.IdCampoContacto =
              pasoActualHistotial.idCampoContacto;
            if (this.datosAlumno.Nombres != null) {
              this.flujoActual.NombreUsuario =
                this.datosAlumno.Nombres.split(' ')[0];
            }
            this.flujoActual.Respuesta =
              pasoActualHistotial.respuesta.toString();
            if (
              pasoActualHistotial.opcionEnviadoJson != undefined &&
              pasoActualHistotial.opcionEnviadoJson != null
            ) {
              this.flujoActual.OpcionEnviadoJson = JSON.stringify(
                pasoActualHistotial.opcionEnviadoJson
              );
            }
            this.SiguientesPasos.forEach((p) => {
              p.respondido = true;
            });
            this.primerpaso = this.SiguientesPasos[0];
            this.pasoActual =
              this.SiguientesPasos[this.SiguientesPasos.length - 1];
          }
          this.FlujoConversacionPrincipal();
        },
        complete: () => {
          this.cargando = true;
        },
      });
  }
  FlujoConversacionPrincipal() {
    this._ChatBotService
      .FlujoConversacionPrincipal(this.flujoActual)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('Respuesta FlujoConversacionPrincipal', x);

          //if(x.itemFlujo==null)
          //{
          //this.flujoActual.EsMensajeFinal=true
          //this.FlujoConversacionPrincipal();
          //}else
          //{
          if (x.itemFlujo != null) {
            this.formControl.reset();
            this.pasoActual = x.itemFlujo;
            this.pasoActual.respuesta = '';
            if (this.pasoActual != null && this.pasoActual != undefined) {
              this.pasoActual.opciones = x.opciones;

              this.pasoActual.idCampoContacto == 5 &&
              this.pasoActual.usuarioRegistrado
                ? (this.pasoActual.mensaje +=
                    '. ¿Sigue siendo tu número ' +
                    this.datosAlumno.Movil +
                    ' ?')
                : '';
              this.pasoActual.validacionCambioMovil = false;
              this.SiguientesPasos.push(this.pasoActual);

              //console.log('documents.get', this.ElementRefTemp);

              if (this.pasoActual.paso == 1) {
                this.primerpaso = this.pasoActual;
              } else {
                this.chat = true;
              }
              this.SetValidator();
              if (this.datosAlumno.Id != null && this.datosAlumno.Id != 0) {
                this.SetDataForm();
              }
            }
            //console.log(this.SiguientesPasos);
            // this.SiguientesPasos[0].fechaRegistrada= this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a'),
            (this.SiguientesPasos[
              this.SiguientesPasos.length - 1
            ].fechaRegistrada = this.datePipe.transform(new Date(), 'hh:mm a')),
              console.log('siguientes pasos Flujo', this.SiguientesPasos);
            this.CargandoChat = false;
            if (this.pasoActual.esMensajeFinal == true) {
              this.flujoActual.EsMensajeFinal = true;
              this.FlujoConversacionPrincipal();
            }

            if (
              this.pasoActual.tipoOpcion == 'TrueFalse' &&
              this.pasoActual.opciones != null &&
              this.pasoActual.opciones != undefined &&
              this.pasoActual.opciones.length > 0
            ) {
              var existenNULL = 0;
              this.pasoActual.opciones.forEach((o: any) => {
                if (o == null || o.idCampo == null || o.idCampo == 0) {
                  existenNULL++;
                }
                o != null ? (o.Check = false) : '';
                // o.validacion=false;
              });
              this.opcionesTruFalse = this.pasoActual.opciones;
              // this.opcionesTruFalse = this.opcionesTruFalse.map((item) => ({
              //   ...item,
              //   validacion: false,
              // }));

              console.log('Existe null opcines cantidad', existenNULL);
              if (existenNULL == this.pasoActual.opciones.length) {
                this.ContinuarOpciones(1);
              } else {
                this.ContinuarOpciones(3);
              }
            }
          }
          // }
          // this.inputChat.nativeElement.focus()
        },
      });
  }
  ProcesarAsignacionAutomaticaChatbot() {
    this._ChatBotService
      .ProcesarAsignacionAutomaticaChatbot(this.OportunidadDTO)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.flujoActual.IdAlumno = x.idAlumno;
          this.flujoActual.IdOportunidad = x.idOportunidad;
          this.ActualizarAlumnoDTO.IdAlumno = x.idAlumno;
          //this.flujoActual.IdAlumno=10550890
          //this.flujoActual.IdOportunidad=2450547

          this.ActualizarIdOportunidadChatbotUsuarioContacto();
          this.FlujoConversacionPrincipal();
        },
      });
  }

  SetPaisCodigo() {
    var codigoISo = this._SessionStorageService.SessionGetValue('ISO_PAIS');
    this.Paises.forEach((p: any) => {
      if (p.codigoIso == codigoISo) {
        this.datosAlumno.IdPais = p.idPais;
        console.log('Set pais Codigo', this.datosAlumno.IdPais);

        this.min = p.longCelularAlterno;
        this.max = p.longCelular;
      }
    });
  }
  SetPaisId() {
    this.Paises.forEach((p: any) => {
      if (p.codigoIso == this.datosAlumno.IdPais) {
        this.min = p.longCelularAlterno;
        this.max = p.longCelular;
      }
    });
  }
  SetValidator() {
    console.log('paso actual', this.pasoActual);
    this.formControl.clearValidators();
    if (this.pasoActual.identificadorApi == 'Email') {
      this.formControl.setValidators([Validators.required, Validators.email]);
    } else if (this.pasoActual.identificadorApi == 'Movil') {
      var idPais =
        this.datosAlumno.IdPais == undefined ? 0 : this.datosAlumno.IdPais;
      console.log('idPais SetValidator', idPais);

      this.formControl.setValidators([
        Validators.required,
        Validators.minLength(this.min),
        Validators.maxLength(this.max),
        MovilValidator(idPais),
      ]);
    } else if (this.pasoActual.identificadorApi == 'Nombres') {
      this.formControl.setValidators([Validators.required]);
    }
    // if(this.pasoActual.identificadorApi=='Dni'){
    //   this.formControl.setValidators([Validators.required])
    // };
    console.log('FormControl ', this.formControl);
  }
  SetDatAlumno() {
    if (this.pasoActual.identificadorApi == 'Email') {
      this.datosAlumno.Email = this.formControl.value;
    } else if (this.pasoActual.identificadorApi == 'Movil') {
      this.datosAlumno.Movil = this.formControl.value;
    } else if (this.pasoActual.identificadorApi == 'Nombres') {
      this.datosAlumno.Nombres = this.formControl.value;
    }
    var dataAlumno = JSON.stringify(this.datosAlumno);
    this._SessionStorageService.SessionSetValue(
      'dataAlumnoChatBot' + this.OportunidadDTO.IdPrograma,
      dataAlumno
    );
  }
  SetDataForm() {
    if (this.pasoActual.identificadorApi == 'Email')
      this.formControl.setValue(this.datosAlumno.Email);
    if (this.pasoActual.identificadorApi == 'Movil')
      this.formControl.setValue(this.datosAlumno.Movil);
    if (this.pasoActual.identificadorApi == 'Nombres')
      this.formControl.setValue(this.datosAlumno.Nombres);
  }
  CleanDataAlumno() {}
  obtenerErrorCampoNombre() {
    var campo = this.formControl;
    if (campo!.hasError('required')) {
      if (this.pasoActual.identificadorApi == 'Email')
        return 'El correo electrónico es necesario';
      if (this.pasoActual.identificadorApi == 'Movil')
        return 'El número telefónico es necesario';
      if (this.pasoActual.identificadorApi == 'Nombres')
        return 'Ingresa tus nombres';
      if (this.pasoActual.identificadorApi == 'Dni')
        return 'Ingresa tu documento de identidad';
      return '';
    }

    if (campo!.hasError('minlength')) {
      if (this.pasoActual.identificadorApi == 'Movil') {
        return 'La longitud debe ser de ' + this.min + ' dígitos minimo';
      }
      return 'La longitud es incorrecta';
    }
    if (campo!.hasError('maxlength')) {
      if (this.pasoActual.identificadorApi == 'Movil') {
        return 'La longitud debe ser de ' + this.max + ' dígitos maximo';
      }
      return 'La longitud es incorrecta';
    }
    if (campo!.hasError('Email')) {
      return 'El campo tiene que ser un correo (example@example.com)';
    }
    if (campo!.hasError('MovilValidator')) {
      var nombre = this.datosAlumno.Nombres.split(' ');
      if (nombre != undefined && nombre.length > 0) {
        return this.pasoActual.mensajeErrorValidacion;
      }
    }
    return this.pasoActual.mensajeErrorValidacion;
  }
  ContinuarFlujo(ValorDB: any) {
    console.log('Paso Actual Continuar Flujo', this.pasoActual);
    if (
      this.pasoActual.nombreFuncion === 'CreacionAlumnoOportunidad' ||
      this.pasoActual.funcionObtenerOpcion ===
        'pw.SP_PW_ChatbotPGeneralMayorProbabilidadTop5_PorAlumno'
    ) {
      this.OportunidadDTO.NombresCompletos = this.datosAlumno.Nombres;
      this.OportunidadDTO.Celular = this.datosAlumno.Movil.toString();
      this.OportunidadDTO.Correo = this.datosAlumno.Email;
      this.OportunidadDTO.IdPais = this.datosAlumno.IdPais;
      this.OportunidadDTO.IdAreaFormacion = this.datosAlumno.IdAreaFormacion;
      this.OportunidadDTO.IdCargo = this.datosAlumno.IdCargo;
      this.OportunidadDTO.IdAreaTrabajo = this.datosAlumno.IdAreaTrabajo;
      this.OportunidadDTO.IdIndustria = this.datosAlumno.IdIndustria;

      this.ProcesarAsignacionAutomaticaChatbot();
    } else if (this.pasoActual.idCampoContacto == 3) {
      console.log('entro a la validacion de correo');
      this.ValidacionAlumnoCorreoChatBot();
    } else if (
      (this.pasoActual.nombreFuncion == 'ActualizarAlumnoProbabilidad' ||
        this.pasoActual.nombreFuncion == 'ActualizarAlumno') &&
      ValorDB != null &&
      ValorDB != undefined &&
      ValorDB != 0
    ) {
      this.ActualizarAlumnoDTO.IdentificadorApi =
        this.pasoActual.identificadorApi;
      this.ActualizarAlumnoDTO.Valor = ValorDB.toString();
      this.ActualizarAlumnoChatBot();
    } else {
      this.FlujoConversacionPrincipal();
    }
  }
  ActualizarIdOportunidadChatbotUsuarioContacto() {
    this._ChatBotService
      .ActualizarIdOportunidadChatbotUsuarioContacto(
        this.flujoActual.IdChatbotUsuarioContacto,
        this.flujoActual.IdOportunidad,
        this.flujoActual.IdAlumno
      )
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {},
      });
  }
  ActualizarAlumnoChatBot() {
    this._ChatBotService
      .ActualizarAlumnoChatBot(this.ActualizarAlumnoDTO)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.FlujoConversacionPrincipal();
        },
      });
  }
  IrChat() {
    this.CargandoChat = true;
    this.SetDatAlumno();
    this.flujoActual.Paso = this.pasoActual.paso;
    this.flujoActual.Caso = this.pasoActual.caso;
    this.flujoActual.MensajeEnviado = this.pasoActual.mensaje;
    this.flujoActual.IdCampoContacto = this.pasoActual.idCampoContacto;
    this.flujoActual.NombreUsuario = this.datosAlumno.Nombres.split(' ')[0];
    this.flujoActual.Respuesta = this.formControl.value;
    if (
      this.pasoActual.opciones != undefined &&
      this.pasoActual.opciones != null
    ) {
      this.flujoActual.OpcionEnviadoJson = JSON.stringify(
        this.pasoActual.opciones
      );
    }
    this.SiguientesPasos.forEach((p) => {
      p.respondido = true;
    });
    this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta =
      this.formControl.value;
    this.ValidacionAlumnoCorreoChatBot();
    console.log('ir chat datos alumno', this.datosAlumno);
  }
  ValidacionAlumnoCorreoChatBot() {
    this._ChatBotService
      .ValidacionAlumnoCorreoChatBot(this.datosAlumno.Email)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('validar correo alumno', x);
          if (x != null && x != undefined) {
            this.datosAlumno.Id = x.idAlumno;
            this.datosAlumno.Movil = x.celular;
            this.datosAlumno.Email = x.correo;
            this.datosAlumno.IdAreaFormacion = x.idAreaFormacion;
            this.datosAlumno.IdAreaTrabajo = x.idAreaTrabajo;
            this.datosAlumno.IdCargo = x.idCargo;
            this.datosAlumno.IdIndustria = x.idIndustria;
            this.datosAlumno.IdPais = x.idPais;
            this.datosAlumno.Nombres = x.nombresCompletos;
            this.ActualizarAlumnoDTO.IdAlumno = x.idAlumno;
            this.flujoActual.UsuarioRegistrado = true;
            this.flujoActual.NombreUsuario = x.nombresCompletos.split(' ')[0];
            this.flujoActual.IdAlumno = x.idAlumno;
            console.log(
              'usuario registrado: ',
              this.flujoActual.UsuarioRegistrado
            );
            this.ActualizarIdOportunidadChatbotUsuarioContacto();
          }
        },
        complete: () => {
          this.FlujoConversacionPrincipal();
        },
      });
  }
  ElementRefTemp: any;
  SiguientePaso(ElementRef?: any) {
    if (ElementRef != null) {
      this.ElementRefTemp = ElementRef;
    }
    if (this.formControl.valid) {
      console.log('entro al siguiente paso');
      this.CargandoChat = true;
      this.SetDatAlumno();
      this.flujoActual.Paso = this.pasoActual.paso;
      this.flujoActual.Caso = this.pasoActual.caso;
      this.flujoActual.MensajeEnviado = this.pasoActual.mensaje;
      this.flujoActual.IdCampoContacto = this.pasoActual.idCampoContacto;
      this.flujoActual.NombreUsuario = this.datosAlumno.Nombres.split(' ')[0];
      this.flujoActual.Respuesta = this.formControl.value.toString();
      if (
        this.pasoActual.opciones != undefined &&
        this.pasoActual.opciones != null
      ) {
        this.flujoActual.OpcionEnviadoJson = JSON.stringify(
          this.pasoActual.opciones
        );
      }
      this.SiguientesPasos.forEach((p) => {
        p.respondido = true;
      });
      this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta =
        this.formControl.value;
      (this.SiguientesPasos[this.SiguientesPasos.length - 1].fechaRegistrada =
        this.datePipe.transform(new Date(), 'hh:mm a')),
        this.ContinuarFlujo(this.formControl.value);
      console.log('datos alumno sigue paso', this.datosAlumno);
      this.validacionCambioMovil = true;
    }
  }
  SelectOpciones(item: any) {
    this.CargandoChat = true;
    if (this.pasoActual.identificadorApi == 'IdAreaFormacion')
      this.datosAlumno.IdAreaFormacion = item.id;
    else if (this.pasoActual.identificadorApi == 'IdAreaTrabajo')
      this.datosAlumno.IdAreaTrabajo = item.id;
    else if (this.pasoActual.identificadorApi == 'IdIndustria')
      this.datosAlumno.IdIndustria = item.id;
    else if (this.pasoActual.identificadorApi == 'IdCargo')
      this.datosAlumno.IdCargo = item.id;

    this.flujoActual.Paso = this.pasoActual.paso;
    this.flujoActual.Caso = this.pasoActual.caso;
    this.flujoActual.MensajeEnviado = this.pasoActual.mensaje;
    this.flujoActual.IdCampoContacto = this.pasoActual.idCampoContacto;
    this.flujoActual.NombreUsuario = this.datosAlumno.Nombres.split(' ')[0];
    this.flujoActual.Respuesta = item.nombre;
    if (
      this.pasoActual.opciones != undefined &&
      this.pasoActual.opciones != null
    ) {
      this.flujoActual.OpcionEnviadoJson = JSON.stringify(
        this.pasoActual.opciones
      );
    }
    if (
      this.pasoActual.funcionObtenerOpcion ===
      'pw.SP_PW_ChatbotPGeneralMayorProbabilidadTop5_PorAlumno'
    ) {
      this.OportunidadDTO.IdPrograma = item.id;
      this.OportunidadDTO.IdPespecifico = this.ObtenerIdPEspecifico(
        item.id,
        this.datosAlumno.IdPais
      );
      this.flujoActual.NombrePGeneral = item.nombre;

      console.log('id nuevo programa seleccionado: ', item.id);
      console.log(
        'idpespecifico nuevo programa',
        this.OportunidadDTO.IdPespecifico
      );
    }
    this.SiguientesPasos.forEach((p) => {
      p.respondido = true;
    });
    this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta =
      item.nombre;
    this.ContinuarFlujo(item.id);
    console.log('select opciones datos alumno', this.datosAlumno);
  }
  ContinuarOpciones(valor: number) {
    console.log('ContinuarOpciones valor', valor);
    this.CargandoChat = true;
    console.log('opcionesTrueFalse: ', this.opcionesTruFalse);
    this.SiguientesPasos.forEach((p) => {
      p.respondido = true;
    });
    if (valor != 1 && valor != 2) {
      this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta = null;
    }
    var hayerrore = false;
    for (let index = 0; index < this.opcionesTruFalse.length; index++) {
      var msg = '';
      if (this.opcionesTruFalse[index].Check != true) {
        if (
          this.opcionesTruFalse[index].idCampo == 0 ||
          this.opcionesTruFalse[index].idCampo == null
        ) {
          msg =
            'Muy Bien ' +
            this.datosAlumno.Nombres.split(' ')[0] +
            ', necesitamos conocer tu <strong>' +
            this.opcionesTruFalse[index].nombre +
            '</strong> por favor selecciona una de las siguientes opciones:';
          //this.SiguientesPasos[this.SiguientesPasos.length - 1].validacionCambio = true;
        } else {
          msg =
            'Muy Bien ' +
            this.datosAlumno.Nombres.split(' ')[0] +
            ', Tu <strong>' +
            this.opcionesTruFalse[index].nombre +
            '</strong> sigue siendo <strong>' +
            this.opcionesTruFalse[index].campo +
            '</strong>?';

          // this.SiguientesPasos[
          //   this.SiguientesPasos.length - 1
          //  ].idCampoContacto = 1;
        }
        this.ObtenerCincoOpcionesPerfilProfesionalChatbot(
          this.opcionesTruFalse[index],
          msg
        );
        hayerrore = true;
        break;
      }
    }
    if (hayerrore == false) {
      this.flujoActual.Paso = this.pasoActual.paso;
      this.flujoActual.Caso = this.pasoActual.caso;
      this.flujoActual.MensajeEnviado = this.pasoActual.mensaje;
      this.flujoActual.IdCampoContacto = this.pasoActual.idCampoContacto;
      this.flujoActual.NombreUsuario = this.datosAlumno.Nombres.split(' ')[0];
      this.flujoActual.Respuesta = '';
      if (
        this.pasoActual.opciones != undefined &&
        this.pasoActual.opciones != null
      ) {
        this.flujoActual.OpcionEnviadoJson = JSON.stringify(
          this.pasoActual.opciones
        );
      }
      this.ContinuarFlujo('');
    }
  }
  ObtenerCincoOpcionesPerfilProfesionalChatbot(data: any, mensaje: string) {
    console.log('obtener 5 opcioones perfil DATOS', this.datos);
    this.datos.CodigoPGeneral = this.flujoActual.CodigoPGeneral;
    this.datos.IdCampo = data.idCampo;
    this.datos.IdCampoContacto = data.id;

    this._ChatBotService
      .ObtenerCincoOpcionesPerfilProfesionalChatbot(this.datos)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('datosIDCAMPO', this.datos.IdCampo);
          console.log(
            'ult respuesta sgutes pasos',
            this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta
          );
          this.SiguientesPasos.push({
            idChatbotConfiguracionFlujo: 1,
            usuarioRegistrado: this.pasoActual.usuarioRegistrado,
            paso: this.pasoActual.paso,
            caso: this.pasoActual.caso,
            esMensajeFinal: false,
            mensaje: mensaje,
            nombreFuncion: this.pasoActual.nombreFuncion,
            mensajeErrorValidacion: this.pasoActual.mensajeErrorValidacion,
            idCampoContacto: this.pasoActual.idCampoContacto,
            identificadorApi: this.pasoActual.identificadorApi,
            opciones: null,
            respuesta: null,
            tipoOpcion: 'TrueFalse',
            opciones2: x,
            validacionCambioMovil: false,
            validacionCambio:
              this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta ==
                'Otras Opciones' || data.idCampo <= 0
                ? true
                : false,
          });

          this.CargandoChat = false;
          console.log(
            'obtenercincoopcionesperfilprofesional SIGUIENTES PASOS',
            this.SiguientesPasos
          );
          this.ScrollTo();
        },
      });
  }

  ActualizarAlumnoChatBot2(valor: number, valorNombre: any) {
    console.log('ACTUAKIZAR ALUMNOS 2 sht pasos', this.SiguientesPasos);
    console.log('valor de entrada ', valor);
    let tamanio = this.SiguientesPasos.length;
    console.log('ultimo sgt paso', this.SiguientesPasos[tamanio - 1]);
    this.SiguientesPasos.forEach((p) => {
      p.respondido = true;
    });
    this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta =
      valorNombre;
    console.log('valor nombre', valorNombre);
    this.datos.PrimerBloque = true;
    this.ActualizarAlumnoDTO.IdAlumno = this.datosAlumno.Id;
    var indicemal = 0;
    var msg = '';
    for (let index = 0; index < this.opcionesTruFalse.length; index++) {
      if (this.opcionesTruFalse[index].Check != true) {
        if (
          this.opcionesTruFalse[index].idCampo == 0 ||
          this.opcionesTruFalse[index].idCampo == null
        ) {
          msg =
            'Muy Bien ' +
            this.datosAlumno.Nombres.split(' ')[0] +
            ', necesitamos conocer tu <strong>' +
            this.opcionesTruFalse[index].nombre +
            '</strong> por favor selecciona una de las siguientes opciones:';
          if (valorNombre ==  "Otras Opciones") {
            msg =
              'A continuación ' +
              this.datosAlumno.Nombres.split(' ')[0] +
              ', necesitamos conocer tu <strong>' +
              this.opcionesTruFalse[index].nombre +
              '</strong> por favor selecciona una de las siguientes opciones:';
          }
          //this.SiguientesPasos[this.SiguientesPasos.length-1].validacionCambio =
          //  true;
        } else {
          msg =
            'Disculpa ' +
            this.datosAlumno.Nombres.split(' ')[0] +
            ', que insistamos en esta información, pero es importante conocer tu <strong>' +
            this.opcionesTruFalse[index].nombre +
            '</strong> para poder darte información personalizada sobre nuestros programas, Selecciona nuevamente entre las siguientes opciones';

          // this.SiguientesPasos[
          //   this.SiguientesPasos.length - 1
          //  ].idCampoContacto = 1;
        }

        indicemal = index;
        break;
      }
    }
    console.log(
      'ActualizarAlumnoChatBot2 opciesTRUEFALSE',
      this.opcionesTruFalse
    );
    console.log('inidcemal', indicemal);
    if (valor == 0 || valor == null) {
      this.datos.PrimerBloque = false;
      this.ObtenerCincoOpcionesPerfilProfesionalChatbot(
        this.opcionesTruFalse[indicemal],
        msg
      );
    } else {
      switch (this.opcionesTruFalse[indicemal].id) {
        case 7:
          this.ActualizarAlumnoDTO.IdentificadorApi = 'IdCargo';
          break;
        case 8:
          this.ActualizarAlumnoDTO.IdentificadorApi = 'IdAreaFormacion';
          break;
        case 9:
          this.ActualizarAlumnoDTO.IdentificadorApi = 'IdAreaTrabajo';
          break;
        case 10:
          this.ActualizarAlumnoDTO.IdentificadorApi = 'IdIndustria';
          break;
        default:
          this.ActualizarAlumnoDTO.IdentificadorApi = 'IdCargo';
          break;
      }
      this.ActualizarAlumnoDTO.Valor = valor.toString();
      console.log('valor', valor.toString());
      this._ChatBotService
        .ActualizarAlumnoChatBot(this.ActualizarAlumnoDTO)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            this.opcionesTruFalse[indicemal].campo = x.registro;
            this.opcionesTruFalse[indicemal].idCampo = valor;
            this.opcionesTruFalse[indicemal].Check = true;
            this.opcionesTruFalse[indicemal].validacion = true;
            this.ContinuarOpciones(2);
          },
        });
    }
  }

  ValidacionDenegadaContinuar() {
    console.log('validacion denegada siguet pasos', this.SiguientesPasos);
    this.SiguientesPasos[this.SiguientesPasos.length - 1].respuesta = 'Si';
    this.SiguientesPasos.forEach((p) => {
      p.respondido = true;
    });
    var indicemal = 0;
    var msg = '';
    for (let index = 0; index < this.opcionesTruFalse.length; index++) {
      if (this.opcionesTruFalse[index].Check != true) {
        if (
          this.opcionesTruFalse[index].idCampo == 0 ||
          this.opcionesTruFalse[index].idCampo == null
        ) {
          msg =
            'Muy Bien ' +
            this.datosAlumno.Nombres.split(' ')[0] +
            ', necesitamos conocer tu <strong>' +
            this.opcionesTruFalse[index].nombre +
            ' /strong> por favor selecciona una de las siguientes opciones:';
          // this.SiguientesPasos[this.SiguientesPasos.length - 1].validacionCambio = true;

          // this.SiguientesPasos[this.SiguientesPasos.length-1].validacionCambio =
          //   true;
        } else {
          msg =
            'Muy Bien ' +
            this.datosAlumno.Nombres.split(' ')[0] +
            ', vemos que cambiaste tu <strong>' +
            this.opcionesTruFalse[index].nombre +
            '</strong> por favor actualizalo seleccionando una de las siguientes opciones:';

          // this.SiguientesPasos[
          //   this.SiguientesPasos.length - 1
          //  ].idCampoContacto= 1;
        }

        indicemal = index;
        break;
      }
    }
    this.opcionesTruFalse[indicemal].validacion = false;
    this.opcionesTruFalse[indicemal].Check = true;
    this.opcionesTruFalse[indicemal].validacion = false;
    this.ContinuarOpciones(2);
  }

  ObtenerUrlProgramaChatBot() {
    this._ChatBotService
      .ObtenerUrlPrograma(this.idBusqueda)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('esta es la url ', x);
          this.urlPrograma = x;
        },
      });
  }

  redigirPaginaCurso() {
    this._ChatBotService
      .ObtenerUrlPrograma(this.idBusqueda)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('esta es la url ', x.url);
          if (x.url != null && x.url != '' && x.url != undefined) {
            this.urlPrograma = x.url;
          }
          this.router.navigate([this.urlPrograma]);
        },
      });
  }

  ObtenerIdPEspecifico(IdPGeneral: any, IdPaisAlumno: any): any {
    this._ChatBotService
      .ObtenerIdPEspecifico(IdPGeneral, IdPaisAlumno)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log('x: ', x);

          console.log('retorno pespecifico x: ', x.pespecifico);
          if (
            x.pespecifico != null &&
            x.pespecifico != '' &&
            x.pespecifico != undefined
          ) {
            this.OportunidadDTO.IdPespecifico = x.pespecifico;
            return x.pespecifico;
          }
        },
      });
  }
  gethora() {
    //this.horaMinuto = new Date();
    this.horaMinuto = this.datePipe.transform(new Date(), 'hh:mm a');
  }
  ScrollTo() {
    //el.scrollIntoView();
    const footer = document.getElementById('footer'); // replace 'footer' with the actual id of your footer element
    if (footer) {
      footer.scrollIntoView();
    }
    //console.log("stroll el ", footer);
  }
}
