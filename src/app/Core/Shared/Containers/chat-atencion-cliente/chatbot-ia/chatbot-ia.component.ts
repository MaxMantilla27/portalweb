import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { AspNetUserService } from '../../../Services/AspNetUser/asp-net-user.service';
import { HelperService } from '../../../Services/helper.service';
import { SessionStorageService } from '../../../Services/session-storage.service';
import { AccountService } from '../../../Services/Account/account.service';
import { AlumnoService } from '../../../Services/Alumno/alumno.service';
import { SnackBarServiceService } from '../../../Services/SnackBarService/snack-bar-service.service';
import { ChatAtencionClienteService } from '../../../Services/ChatAtencionCliente/chat-atencion-cliente.service';
import {
  MensajeChatbotIADTO,
  RegistroChatbotIADTO,
} from 'src/app/Core/Models/ChatbotIADTO';
import { ChatbotIAService } from '../../../Services/ChatbotIA/chatbot-ia.service';

import { DatosPerfilService } from '../../../Services/DatosPerfil/datos-perfil.service';
import { ChatEnLineaService } from '../../../Services/ChatEnLinea/chat-en-linea.service';
import { SeccionProgramaService } from '../../../Services/SeccionPrograma/seccion-programa.service';
import { Subject, Subscription, takeUntil, timer, filter } from 'rxjs';
import {
  ChatAtencionClienteContactoDetalleRegistrarDTO,
  ChatAtencionClienteContactoRegistrarDTO,
} from 'src/app/Core/Models/ChatAtencionClienteDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';

@Component({
  selector: 'app-chatbot-ia',
  templateUrl: './chatbot-ia.component.html',
  styleUrls: ['./chatbot-ia.component.scss'],
})
export class ChatbotIaComponent implements OnInit {
  constructor(
    private _router: Router,
    private chatbotIAService: ChatbotIAService,
    private _SessionStorageService: SessionStorageService,
    private _HelperService: HelperService,
    private cd: ChangeDetectorRef,
    private _ChatEnLinea: ChatEnLineaService,
    private _DatosPerfilService: DatosPerfilService,
    private _ChatAtencionClienteService: ChatAtencionClienteService,
    private _AlumnoService: AlumnoService
  ) {}
  mensajes: MensajeChatbotIADTO[] = [];

  registroChatIA: RegistroChatbotIADTO = {
    Cerrado: false,
    Derivado: false,
  };

  public DatoObservable: DatoObservableDTO = {
    datoAvatar: false,
    datoContenido: false,
  };
  private signal$ = new Subject();
  ChatError: boolean = false;
  ChatErrorBotRecarga: boolean = false;
  inputActive = true;
  nuevoMensaje: string = '';
  isBubbleOpen: boolean = false;
  stateAsesor: boolean = true;
  public stateAsesorAtc = false;
  public CargandoInformacion = false;
  public TieneCoordinador = false;
  public ChatbotCerrado = false;
  public ChatVentasAbierto = false;
  public ChatAcademicoAbierto = false;
  public interval: any;
  public intervalPrevio: any;
  public RegistroChatAtc: ChatAtencionClienteContactoRegistrarDTO = {
    IdChatbotPortalHiloChat: 0,
    FormularioEnviado: false,
    ChatFinalizado: false,
    IdOportunidad: 0,
    IdMatriculaCabecera: 0,
    EsAcademico: false,
    EsSoporteTecnico: false,
  };
  public RegistroChatDetalleAtc: ChatAtencionClienteContactoDetalleRegistrarDTO =
    {
      IdChatAtencionClienteContacto: 0,
      PasoActual: 0,
      CasoActual: '',
      PasoSiguiente: 0,
      CasoSiguiente: '',
      MensajeEnviado: '',
    };
  public EsSoporteTecnico = false;
  public IdChatAtencionClienteContacto = 0;
  public RespuestaDerivacion: any;
  @ViewChild('contenidoMsj') contenidoMsj!: ElementRef;
  @ViewChild('inputChat') inputChat!: ElementRef;
  @Input() Open: boolean = false;

  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() IdProgramageneral = 0;
  @Input() IdPespecificoPrograma = 0;

  public IdChatbotPortalHiloChat = 0;
  public TieneCursosMatriculados = false;
  public EstadoEscribiendo = false;
  public DatosCurso: any;
  public datos: DatosFormularioDTO = {
    nombres: '',
    apellidos: '',
    email: '',
    idPais: undefined,
    idRegion: undefined,
    movil: '',
    idCargo: undefined,
    idAreaFormacion: undefined,
    idAreaTrabajo: undefined,
    idIndustria: undefined,
  };
  textareaHeight: number = 20; // Altura inicial, en píxeles
  ngOnInit(): void {
    this.ObtenerHistorialChatBotIA();
    this.ReinicioTotalChat();
    this._HelperService.recibirDatoCuenta
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          let reinicioChatBot =
            this._SessionStorageService.SessionGetValue('ReinicioChatBot');
          if (reinicioChatBot == 'true') {
            this.ObtenerHistorialChatBotIA();
          }
          this.ReinicioTotalChat();
        },
        complete: () => {},
      });
  }

  ReinicioTotalChat() {
    let IdChatbotPortalHiloChatLocal =
      this._SessionStorageService.SessionGetValue('IdChatbotPortalHiloChat');
    let reinicioChatBot =
      this._SessionStorageService.SessionGetValue('ReinicioChatBot');
    if (IdChatbotPortalHiloChatLocal != '' && reinicioChatBot == 'true') {
      this.IdChatbotPortalHiloChat = Number(IdChatbotPortalHiloChatLocal);
      this.CerrarRegistroHiloChat(this.IdChatbotPortalHiloChat);
    }
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  reiniciarChat() {
    this.ChatErrorBotRecarga = false;
    this.mensajes = [];
    this.registroChatIA = {
      Cerrado: false,
      Derivado: false,
    };
    this.ChatError = false;
    this.inputActive = true;
    this.nuevoMensaje = '';
    this.ChatbotCerrado = false;
    this.ChatVentasAbierto = false;
    this.ChatAcademicoAbierto = false;
    this.TieneCoordinador = false;
    this._SessionStorageService.SessionSetValue('ReinicioChatBot', 'false');
    this.enviarMensajeInicial();
  }
  CerrarRegistroHiloChat(IdChatbotPortalHiloChat: number) {
    let IdContactoPortalSegmento =
      this._SessionStorageService.SessionGetValue('usuarioWeb');
    this.CargandoInformacion = true;
    if (IdChatbotPortalHiloChat == 0) {
      IdChatbotPortalHiloChat =
        this.registroChatIA.IdChatbotPortalHiloChat ?? 0;
    }
    this.chatbotIAService
      .CerrarRegistroHiloChat(IdChatbotPortalHiloChat, IdContactoPortalSegmento)
      .subscribe({
        next: (response) => {},
        complete: () => {
          this.reiniciarChat();
        },
      });
  }
  //Abre el chat e inicia con el mensaje inicial
  toggleChat(state: boolean) {
    this.Open = state;
    this.IsOpen.emit(state);
    if (this.Open) {
      if (this.mensajes.length == 0) {
        this.enviarMensajeInicial();
      }
      this.scrollAbajo(true, 1);
    }
  }

  enviarMensaje(): void {
    if (this.nuevoMensaje.trim() && this.inputActive) {
      this.inputActive = false;
      this.mensajes.push({
        esUsuario: true,
        mensaje: this.nuevoMensaje,
        fechaEnvio: this.ObtenerHoraActual(),
      });
      this.scrollAbajo(true, 2);
      this.registroChatIA.Mensaje = this.nuevoMensaje;
      this.registroChatIA.TiempoActual = new Date();
      this.nuevoMensaje = '';

      this.mostrarEscribiendo();

      this.enviarYProcesar(() => {
        this.reemplazarMensajeBot();
        this.inputActive = this.registroChatIA.Cerrado ? false : true;
        console.log(this.registroChatIA);
        this.IdChatbotPortalHiloChat = this.registroChatIA.IdChatbotPortalHiloChat!;
        this.setFocusOnInput();
        if (this.registroChatIA.Derivado) {
          setTimeout(() => {
            // Derivación a Académico
            if (
              this.registroChatIA.ChatDerivado === 1 &&
              this.registroChatIA.IdMatriculaCabecera != null &&
              this.registroChatIA.IdPGeneral != null
            ) {
              console.log('DERIVANDO A ACADÉMICO')
              this.RegistrarDerivacionATC(this.registroChatIA.ChatDerivado,this.registroChatIA.IdMatriculaCabecera,this.registroChatIA.IdChatbotPortalHiloChat!)
            //Derivación a Ventas
            }
            if (this.registroChatIA.ChatDerivado === 2) {
              console.log('DERIVANDO A VENTAS')
              this.ActualizarCodigoAreaDerivacionHiloChat(this.registroChatIA.ChatDerivado,this.registroChatIA.IdChatbotPortalHiloChat!);
            }
          }, 6000);
        }
      });
    }
  }

  // Estructura el mensaje inicial
  enviarMensajeInicial(): void {
    this.CargandoInformacion = true;

    this.inputActive = false;
    this.registroChatIA.TiempoActual = new Date();

    this.enviarYProcesar(() => {
      if (this.registroChatIA.Mensaje != '') {
        this.mensajes.push({
          mensaje: this.registroChatIA.Mensaje ?? '',
          esUsuario: false,
          fechaEnvio: this.ObtenerHoraActual(),
        });
      }
      this.inputActive = true;

      this.CargandoInformacion = false;
      this.scrollAbajo(true, 5);
    });
  }

  // Llama al endpoint y procesa la respuesta
  enviarYProcesar(callback: () => void): void {
    this.interval = setTimeout(() => {
      var usuarioWeb =
        this._SessionStorageService.SessionGetValue('usuarioWeb');
      if (usuarioWeb != '') {
        clearTimeout(this.interval);
        if (!this.registroChatIA.IdContactoPortalSegmento) {
          this.registroChatIA.IdContactoPortalSegmento = usuarioWeb;
        }
        if (!this.registroChatIA.IdAlumno) {
          this.registroChatIA.IdAlumno = 0;
        }
        this.chatbotIAService.EnviarMensajeBot(this.registroChatIA).subscribe({
          next: (response) => {
            //Realiza el inicio de sesión del usuario
            if (response.TokenData != null) {
              this._SessionStorageService.SetToken(response.TokenData.Token);
              this._AlumnoService.ObtenerCombosPerfil().subscribe({
                next: (x) => {
                  this.datos.nombres = x.datosAlumno.nombres;
                  this.datos.apellidos = x.datosAlumno.apellidos;
                  this.datos.email = x.datosAlumno.email;
                  this.datos.idPais = x.datosAlumno.idPais;
                  this.datos.idRegion = x.datosAlumno.idDepartamento;
                  this.datos.movil = x.datosAlumno.telefono;
                  this.datos.idCargo = x.datosAlumno.idCargo;
                  this.datos.idAreaFormacion = x.datosAlumno.idAreaFormacion;
                  this.datos.idAreaTrabajo = x.datosAlumno.idAreaTrabajo;
                  this.datos.idIndustria = x.datosAlumno.idIndustria;

                  this._SessionStorageService.SessionSetValue(
                    'DatosFormulario',
                    JSON.stringify(this.datos)
                  );
                },
              });
              this.DatoObservable.datoAvatar = true;
              this.DatoObservable.datoContenido = true;
              this._HelperService.enviarDatoCuenta(this.DatoObservable);
              this._SessionStorageService.SessionSetValue(
                'IdProveedor',
                response.idProveedor
              );
              this._SessionStorageService.SessionSetValue(
                'Cursos',
                response.cursos
              );
              this._SessionStorageService.SessionSetValue(
                'TipoCarrera',
                response.tipoCarrera
              );
            }
            if (response.Excepcion == null) {
              let data = JSON.parse(JSON.stringify(response.Data));
              this.registroChatIA = this.jsonADTO(data);
              this._SessionStorageService.SessionSetValue(
                'IdChatbotPortalHiloChat',
                this.registroChatIA.IdChatbotPortalHiloChat!.toString()
              );

              callback();
            } else {
              this.ChatError = true;
              this.CargandoInformacion = false;
            }
          },
          complete: () => {
            this.EstadoEscribiendo = false;
            this.registroChatIA.IdContactoPortalSegmento = usuarioWeb;
          },
          error: (e) => {
            console.error('Error al obtener la respuesta de la API', e);
            this.ChatError = true;
            this.ChatErrorBotRecarga = true;
            this.EstadoEscribiendo = false;
            this.scrollAbajo(true, 10);
          },
        });
      }
    }, 1000);
  }

  //Tranforma JSON a RegistroChatbotIADTO
  jsonADTO(data: any): RegistroChatbotIADTO {
    if (data.tiempoActual) {
      data.tiempoActual = new Date(data.tiempoActual);
    }

    const registro: RegistroChatbotIADTO = data as RegistroChatbotIADTO;
    return registro;
  }

  // Enviar el mensaje al bot
  enviarMensajeBot(): void {
    this.inputActive = false;
    if (this.nuevoMensaje.trim()) {
      this.mensajes.push({
        mensaje: this.nuevoMensaje,
        esUsuario: true,
        fechaEnvio: this.ObtenerHoraActual(),
      });
      this.nuevoMensaje = '';
      this.mostrarEscribiendo();
    }
  }

  // Luego de un cambio (agregar un mensaje) ejecuta la función para bajar el scroll
  ngAfterViewChecked() {
    this.cd.detectChanges();
    if (this.CargandoInformacion) {
      // this.scrollAbajo(true,0000); // Baja automáticamente después de renderizar
    }
  }

  //Enfoca al input luego de recibir el mensaje
  private setFocusOnInput(): void {
    setTimeout(() => {
      if (this.inputChat && this.inputChat.nativeElement) {
        this.inputChat.nativeElement.focus();
      }
    }, 0);
  }

  // Muestra 'Escribiendo...'  para que el usuario sepa que no se ha colgado
  mostrarEscribiendo(): void {
    this.EstadoEscribiendo = true;
    this.mensajes.push({
      mensaje: 'Escribiendo...',
      esUsuario: false,
      fechaEnvio: this.ObtenerHoraActual(),
    });
    this.scrollAbajo(true, 3);
  }

  // Reemplaza el último mensaje del bot (los "...")
  reemplazarMensajeBot(): void {
    this.mensajes[this.mensajes.length - 1].mensaje =
      this.registroChatIA.Mensaje!;
    this.scrollAbajo(true, 4);
  }

  ObtenerCoordinadorMatricula(IdMatriculaCabecera: number) {
    this._ChatEnLinea
      .ObtenerCoordinadorChat(IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if (x != null) {
            this.TieneCoordinador = true;
          } else {
            this.TieneCoordinador = false;
          }
        },
        complete: () => {
          setTimeout(() => {
            this.ChatbotCerrado = true;
            this.ChatAcademicoAbierto = true;
          }, 3000);
        },
      });
  }

  Contactenos() {
    this._router.navigate(['/contactenos']);
  }
  ObtenerHistorialChatBotIA() {
    this.mensajes = [];
    this.intervalPrevio = setTimeout(() => {
      var usuarioWeb =
        this._SessionStorageService.SessionGetValue('usuarioWeb');
      if (usuarioWeb != '') {
        clearTimeout(this.intervalPrevio);
        this.registroChatIA.IdContactoPortalSegmento = usuarioWeb;
        this.ObtenerEstadoDerivacionHiloChat(
          this.registroChatIA.IdContactoPortalSegmento
        );
      }
    }, 1000);
  }
  ActualizarCodigoAreaDerivacionHiloChat(CodigoAreaDerivacion: number,IdChatbotPortalHiloChat:number) {
    this.chatbotIAService
      .ActualizarCodigoAreaDerivacionHiloChat(
        this.registroChatIA.IdChatbotPortalHiloChat!,
        CodigoAreaDerivacion
      )
      .subscribe({
        next: (response) => {},
        complete: () => {
          this.IdChatbotPortalHiloChat = IdChatbotPortalHiloChat;
          this.RegistroChatAtc.IdChatbotPortalHiloChat = IdChatbotPortalHiloChat
          this.RegistroChatAtc.FormularioEnviado = false;
          this.RegistroChatAtc.ChatFinalizado = false;
          this.RegistroChatAtc.IdOportunidad = 0;
          this._ChatAtencionClienteService
            .RegistrarChatAtencionClienteContacto(this.RegistroChatAtc)
            .pipe(takeUntil(this.signal$))
            .subscribe({
              next: (x) => {
                this.IdChatAtencionClienteContacto = x;
              },
              complete: () => {
                this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto = this.IdChatAtencionClienteContacto;
                this.RegistroChatDetalleAtc.PasoActual = 1;
                this.RegistroChatDetalleAtc.CasoActual = 'A';
                this.RegistroChatDetalleAtc.PasoSiguiente = 1;
                this.RegistroChatDetalleAtc.CasoSiguiente = 'A';
                this.RegistroChatDetalleAtc.MensajeEnviado = 'Soy alumno';
                this._ChatAtencionClienteService
                  .RegistrarChatAtencionClienteContactoDetalle(
                    this.RegistroChatDetalleAtc
                  )
                  .pipe(takeUntil(this.signal$))
                  .subscribe({
                    next: (x) => {},
                    complete:()=>{
                      this.ChatbotCerrado = true;
                      this.ChatVentasAbierto = true;
                    }
                  });
              },
            });
        },
      });
  }
  RegistrarDerivacionATC(CodigoAreaDerivacion: number,IdMatriculaCabecera:number,IdChatbotPortalHiloChat:number) {
    this.chatbotIAService
      .ActualizarCodigoAreaDerivacionHiloChat(
        this.registroChatIA.IdChatbotPortalHiloChat!,
        CodigoAreaDerivacion
      )
      .subscribe({
        next: (response) => {},
        complete: () => {
          this.IdChatbotPortalHiloChat = IdChatbotPortalHiloChat;
          this.RegistroChatAtc.IdChatbotPortalHiloChat =IdChatbotPortalHiloChat;
          this.RegistroChatAtc.FormularioEnviado = false;
          this.RegistroChatAtc.ChatFinalizado = false;
          this.RegistroChatAtc.EsAcademico = true;
          this.RegistroChatAtc.EsSoporteTecnico = false;
          this.RegistroChatAtc.IdMatriculaCabecera = IdMatriculaCabecera;
          this._ChatAtencionClienteService
            .RegistrarChatAtencionClienteContacto(this.RegistroChatAtc)
            .pipe(takeUntil(this.signal$))
            .subscribe({
              next: (x) => {
                this.IdChatAtencionClienteContacto = x;
              },
              complete: () => {
                this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto =
                  this.IdChatAtencionClienteContacto;
                this.RegistroChatDetalleAtc.PasoActual = 1;
                this.RegistroChatDetalleAtc.CasoActual = 'B';
                this.RegistroChatDetalleAtc.PasoSiguiente = 1;
                this.RegistroChatDetalleAtc.CasoSiguiente = 'B';
                this.RegistroChatDetalleAtc.MensajeEnviado = IdMatriculaCabecera.toString();
                this._ChatAtencionClienteService
                  .RegistrarChatAtencionClienteContactoDetalle(
                    this.RegistroChatDetalleAtc
                  )
                  .pipe(takeUntil(this.signal$))
                  .subscribe({
                    next: (x) => {},
                    complete:()=> {
                      this.ChatAcademicoAbierto=true;
                      this.ChatbotCerrado = true;
                      this.ObtenerCoordinadorMatricula(IdMatriculaCabecera);
                    },
                  });
              },
            });
        },
      });
  }

  ObtenerEstadoDerivacionHiloChat(IdContactoPortalSegmento: string) {
    this.RespuestaDerivacion = undefined;
    // this.ChatVentasAbierto;
    this.chatbotIAService
      .ObtenerEstadoDerivacionHiloChat(IdContactoPortalSegmento)
      .subscribe({
        next: (response) => {
          console.log(response);
          if(response!=null){
            this.IdChatbotPortalHiloChat=response.idChatbotPortalHiloChat
            this.IdChatAtencionClienteContacto=response.idChatAtencionClienteContacto
          }
          this.RespuestaDerivacion = response;
        },
        complete: () => {
          setTimeout(() => {
            if (this.RespuestaDerivacion != null) {
              if (
                this.RespuestaDerivacion.CodigoAreaDerivacion != 0 &&
                this.RespuestaDerivacion.derivacionCerrada != 0
              ) {
                if (this.RespuestaDerivacion.codigoAreaDerivacion == 2) {
                  console.log('Ingresa a Ventas');
                  this.ChatbotCerrado = true;
                  this.ChatVentasAbierto = true;
                }
                if (this.RespuestaDerivacion.codigoAreaDerivacion == 1) {
                  console.log('Ingresa a Academico');
                  this.registroChatIA.IdMatriculaCabecera =
                    this.RespuestaDerivacion.idMatriculaCabecera;
                  this.ObtenerCoordinadorMatricula(
                    this.registroChatIA.IdMatriculaCabecera!
                  );
                  this.RegistroDirectoCursoMatriculado(false, 1);

                  setTimeout(() => {
                    this.ChatbotCerrado = true;
                    this.ChatAcademicoAbierto = true;
                  }, 3000);
                }
              }
            }
            this.chatbotIAService
              .ObtenerHistorialMensajeUsuarioHiloChat(IdContactoPortalSegmento)
              .subscribe({
                next: (response) => {
                  console.log(response);
                  //Realiza el inicio de sesión del usuario
                  if (response != null)
                    response.slice(1).forEach((historial: any) => {
                      const fecha = new Date(historial.tiempoEnvio);
                      const opciones: Intl.DateTimeFormatOptions = {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      };
                      let horaMensajeHistorico = fecha.toLocaleTimeString(
                        'es-ES',
                        opciones
                      );
                      this.mensajes.push({
                        mensaje: historial.contenido,
                        esUsuario: historial.esUsuario,
                        fechaEnvio: horaMensajeHistorico,
                      });
                    });
                  {
                  }
                },
                complete: () => {},
                error: (e) => {
                  console.error(
                    'Error al obtener el historial respuesta de la API',
                    e
                  );
                  this.ChatError = true;
                },
              });
          }, 3000);
        },
      });
  }
  scrollAbajo(smooth: boolean = true, id: number) {
    setTimeout(() => {
      if (this.contenidoMsj) {
        const nativeElement = this.contenidoMsj.nativeElement;
        nativeElement.scrollTo({
          top: nativeElement.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }, 100);
  }

  RegistroDirectoCursoMatriculado(EsSoporteTecnico: boolean, valor: number) {
    this._ChatAtencionClienteService
      .ObtenerChatAtencionClienteContactoDetalleAcademico(
        this.registroChatIA.IdMatriculaCabecera!
      )
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if (x != null) {
            this.IdChatAtencionClienteContacto =
              x.idChatAtencionClienteContacto;
          }
        },
      });
    if (this.IdChatAtencionClienteContacto == 0) {
      this._DatosPerfilService
        .RegistroProgramaMatriculadoPorIdMatricula(
          this.registroChatIA.IdMatriculaCabecera!
        )
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            this._HelperService
              .recibirMsjChat()
              .pipe(takeUntil(this.signal$))
              .subscribe({
                next: (x) => {},
              });
            this.DatosCurso = x;
          },
          complete: () => {
            this.RegistroChatAtc.IdChatbotPortalHiloChat =
              this.registroChatIA.IdChatbotPortalHiloChat!;
            this.RegistroChatAtc.FormularioEnviado = true;
            this.RegistroChatAtc.ChatFinalizado = false;
            this.RegistroChatAtc.IdOportunidad = 0;
            this.RegistroChatAtc.IdMatriculaCabecera =
              this.registroChatIA.IdMatriculaCabecera!;
            this.RegistroChatAtc.EsAcademico = true;
            this.RegistroChatAtc.EsSoporteTecnico = EsSoporteTecnico;
            this._ChatAtencionClienteService
              .RegistrarChatAtencionClienteContacto(this.RegistroChatAtc)
              .pipe(takeUntil(this.signal$))
              .subscribe({
                next: (x) => {
                  this.IdChatAtencionClienteContacto = x;
                },
                complete: () => {
                  if (EsSoporteTecnico) {
                    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto =
                      this.IdChatAtencionClienteContacto;
                    this.RegistroChatDetalleAtc.PasoActual = 3;
                    this.RegistroChatDetalleAtc.CasoActual = 'B';
                    this.RegistroChatDetalleAtc.PasoSiguiente = 4;
                    this.RegistroChatDetalleAtc.CasoSiguiente = 'B';
                    this.RegistroChatDetalleAtc.MensajeEnviado =
                      'Tengo problemas técnicos en el aula virtual';
                    this._ChatAtencionClienteService
                      .RegistrarChatAtencionClienteContactoDetalle(
                        this.RegistroChatDetalleAtc
                      )
                      .pipe(takeUntil(this.signal$))
                      .subscribe({
                        next: (x) => {},
                      });
                  } else {
                    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto =
                      this.IdChatAtencionClienteContacto;
                    this.RegistroChatDetalleAtc.PasoActual = 3;
                    this.RegistroChatDetalleAtc.CasoActual = 'B';
                    this.RegistroChatDetalleAtc.PasoSiguiente = 4;
                    this.RegistroChatDetalleAtc.CasoSiguiente = 'B';
                    this.RegistroChatDetalleAtc.MensajeEnviado =
                      'Contactar con un Coordinador Académico';
                    this._ChatAtencionClienteService
                      .RegistrarChatAtencionClienteContactoDetalle(
                        this.RegistroChatDetalleAtc
                      )
                      .pipe(takeUntil(this.signal$))
                      .subscribe({
                        next: (x) => {},
                      });
                  }
                  this._SessionStorageService.SessionSetValue(
                    'ChatAcademicoIniciado',
                    'true'
                  );
                },
              });
          },
        });
    } else {
      if (EsSoporteTecnico) {
        this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto =
          this.IdChatAtencionClienteContacto;
        this.RegistroChatDetalleAtc.PasoActual = 3;
        this.RegistroChatDetalleAtc.CasoActual = 'B';
        this.RegistroChatDetalleAtc.PasoSiguiente = 4;
        this.RegistroChatDetalleAtc.CasoSiguiente = 'B';
        this.RegistroChatDetalleAtc.MensajeEnviado =
          'Tengo problemas técnicos en el aula virtual';
        this._ChatAtencionClienteService
          .RegistrarChatAtencionClienteContactoDetalle(
            this.RegistroChatDetalleAtc
          )
          .pipe(takeUntil(this.signal$))
          .subscribe({
            next: (x) => {},
          });
      } else {
        this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto =
          this.IdChatAtencionClienteContacto;
        this.RegistroChatDetalleAtc.PasoActual = 3;
        this.RegistroChatDetalleAtc.CasoActual = 'B';
        this.RegistroChatDetalleAtc.PasoSiguiente = 4;
        this.RegistroChatDetalleAtc.CasoSiguiente = 'B';
        this.RegistroChatDetalleAtc.MensajeEnviado =
          'Contactar con un Coordinador Académico';
        this._ChatAtencionClienteService
          .RegistrarChatAtencionClienteContactoDetalle(
            this.RegistroChatDetalleAtc
          )
          .pipe(takeUntil(this.signal$))
          .subscribe({
            next: (x) => {},
          });
      }
      this._SessionStorageService.SessionSetValue(
        'ChatAcademicoIniciado',
        'true'
      );
    }
  }
  ObtenerHoraActual() {
    const ahora = new Date();
    let horaActual = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return horaActual;
  }
  redimendisionarTextareaChatbot(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    // Establecer el estilo de "height" a "auto" para permitir que se ajuste dinámicamente
    textarea.style.height = 'auto';

    // Obtener el estilo de línea y calcular la altura máxima permitida
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight); // La altura de una línea
    const maxHeight = lineHeight * 3; // La altura máxima que debe tener el textarea (3 líneas)

    // Si el contenido es mayor que la altura máxima de 3 líneas, se activa el scroll
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`; // Limita la altura a 3 líneas
      textarea.style.overflowY = 'auto'; // Activar el scroll
    } else {
      // Ajustar la altura a la altura del contenido
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = 'hidden'; // Desactivar el scroll si hay menos contenido
    }
  }
  resetTextareaHeight(): void {
    const textarea = document.querySelector(
      '.chat-box-ia-textarea'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // Restablecer la altura a auto
      textarea.style.height = `${parseInt(
        getComputedStyle(textarea).lineHeight
      )}px`; // Establecer altura a una línea
      textarea.style.overflowY = 'hidden'; // Desactivar el scroll
    }
  }
}
