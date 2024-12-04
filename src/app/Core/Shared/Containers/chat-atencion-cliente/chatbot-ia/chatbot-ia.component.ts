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

@Component({
  selector: 'app-chatbot-ia',
  templateUrl: './chatbot-ia.component.html',
  styleUrls: ['./chatbot-ia.component.scss'],
})
export class ChatbotIaComponent implements OnInit {
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
    IdContactoPortalSegmento: '',
    IdPGeneral: 0,
    IdPEspecifico: 0,
    IdAlumno: 0,
    ChatIniciado: false,
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
  @ViewChild('contenidoMsj') contenidoMsj!: ElementRef;
  @ViewChild('inputChat') inputChat!: ElementRef;
  @Input() Open: boolean = false;

  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() IdProgramageneral = 0;
  @Input() IdPespecificoPrograma = 0;

  constructor(
    private _router: Router,
    private chatbotIAService: ChatbotIAService,
    private _SessionStorageService: SessionStorageService,
    private _HelperService: HelperService,
    private cd: ChangeDetectorRef,
    private _ChatEnLinea: ChatEnLineaService,
    private _DatosPerfilService: DatosPerfilService,
    private _ChatAtencionClienteService: ChatAtencionClienteService
  ) {}
  public IdChatbotIAPortalHiloChat = 0;
  public TieneCursosMatriculados = false;
  public EstadoEscribiendo = false;
  public DatosCurso: any;

  ngOnInit(): void {
    this.ObtenerHistorialChatBotIA();
    let IdChatbotIAPortalHiloChatLocal =
    this._SessionStorageService.SessionGetValue('IdChatbotIAPortalHiloChat');
    let reinicioChatBot =
    this._SessionStorageService.SessionGetValue('ReinicioChatBot');

  if (IdChatbotIAPortalHiloChatLocal != '' && reinicioChatBot == 'true') {
      console.log(IdChatbotIAPortalHiloChatLocal);
      console.log(reinicioChatBot);
      this.IdChatbotIAPortalHiloChat = Number(IdChatbotIAPortalHiloChatLocal);
      this.CerrarRegistroHiloChat(this.IdChatbotIAPortalHiloChat);
    }

    this._HelperService.recibirDatoCuenta
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);

        },
        complete: () => {
          let IdChatbotIAPortalHiloChatLocal =
            this._SessionStorageService.SessionGetValue(
              'IdChatbotIAPortalHiloChat'
            );

          if (this._SessionStorageService.GetToken() == null) {
            if (IdChatbotIAPortalHiloChatLocal != '') {
              this.IdChatbotIAPortalHiloChat = Number(
                IdChatbotIAPortalHiloChatLocal
              );
              this.CerrarRegistroHiloChat(this.IdChatbotIAPortalHiloChat);
              console.log(reinicioChatBot)
            }
          } else {
          }
          console.log(IdChatbotIAPortalHiloChatLocal);
        },
      });

  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  reiniciarChat() {
    console.log('Reiniciando CHAT');
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
    this._SessionStorageService.SessionSetValue('ReinicioChatBot','false');
    this.enviarMensajeInicial();
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

      this.mensajes.push({ esUsuario: true, mensaje: this.nuevoMensaje });
      this.scrollAbajo(true, 2);
      this.registroChatIA.Mensaje = this.nuevoMensaje;
      this.registroChatIA.TiempoActual = new Date();
      this.nuevoMensaje = '';

      this.mostrarEscribiendo();

      this.enviarYProcesar(() => {
        this.reemplazarMensajeBot();
        this.inputActive = this.registroChatIA.Cerrado ? false : true;
        this.setFocusOnInput();
        if (this.registroChatIA.Derivado) {
          setTimeout(() => {
            console.log(this.registroChatIA);
            if (
              this.registroChatIA.ChatDerivado == 1 &&
              this.registroChatIA.IdMatriculaCabecera != null &&
              this.registroChatIA.IdPGeneral != null
            ) {
              console.log('ventitas');
              this.ObtenerCursosMatriculadosAlumno(
                this.registroChatIA.IdAlumno!
              );
            }
            if (this.registroChatIA.ChatDerivado == 2) {
              console.log('matriculitas');
              this.ActualizarIdAreaDerivacionHiloChat(
                this.registroChatIA.ChatDerivado
              );
              this.ChatbotCerrado = true;
              this.ChatVentasAbierto = true;
              console.log('INGRESO AL FLUJO 2');
            }
            console.log('ChatbotCerrado es: ', this.ChatbotCerrado);
            console.log('ChatbotVentas es: ', this.ChatVentasAbierto);
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
        this.registroChatIA.IdContactoPortalSegmento = usuarioWeb;
        this.chatbotIAService.EnviarMensajeBot(this.registroChatIA).subscribe({
          next: (response) => {
            console.log(response);
            //Realiza el inicio de sesión del usuario
            if (response.TokenData != null) {
              this._SessionStorageService.SetToken(response.TokenData.Token);
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
              console.log('DATA', data);
              this.registroChatIA = this.jsonADTO(data);
              this._SessionStorageService.SessionSetValue(
                'IdChatbotIAPortalHiloChat',
                this.registroChatIA.IdChatbotIAPortalHiloChat!.toString()
              );

              callback();
            } else {
              this.ChatError = true;
              this.CargandoInformacion = false;
            }
          },
          complete: () => {},
          error: (e) => {
            console.error('Error al obtener la respuesta de la API', e);
            this.ChatError = true;
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
      });
      this.nuevoMensaje = '';
      this.mostrarEscribiendo();
    }
  }

  // Luego de un cambio (agregar un mensaje) ejecuta la función para bajar el scroll
  ngAfterViewChecked() {
    // console.log('ACTUALIZAR');
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
    this.mensajes.push({ mensaje: 'Escribiendo...', esUsuario: false });
    this.scrollAbajo(true, 3);
  }

  // Reemplaza el último mensaje del bot (los "...")
  reemplazarMensajeBot(): void {
    this.EstadoEscribiendo = false;
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
          console.log('Información del coordinador', x);
          if (x != null) {
            this.TieneCoordinador = true;
          } else {
            this.TieneCoordinador = false;
          }
        },
        complete: () => {
          this.ChatbotCerrado = true;
          this.ChatAcademicoAbierto = true;
          console.log('EL RESULTADO: ', this.ChatbotCerrado);
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
        this.chatbotIAService
          .ObtenerHistorialMensajeUsuarioHiloChat(
            this.registroChatIA.IdContactoPortalSegmento
          )
          .subscribe({
            next: (response) => {
              console.log('Historial del chat:', response);
              //Realiza el inicio de sesión del usuario
              if (response != null)
                response.slice(1).forEach((historial: any) => {
                  this.mensajes.push({
                    mensaje: historial.contenido,
                    esUsuario: historial.esUsuario,
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
      }
    }, 1000);
  }
  ActualizarIdAreaDerivacionHiloChat(IdAreaDerivacion: number) {
    console.log('AREA A DERIVADA', IdAreaDerivacion);
    this.chatbotIAService
      .ActualizarIdAreaDerivacionHiloChat(
        this.registroChatIA.IdChatbotIAPortalHiloChat!,
        IdAreaDerivacion
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
      });
  }
  CerrarRegistroHiloChat(IdChatbotIAPortalHiloChat: number) {
    this.CargandoInformacion = true;
    if (IdChatbotIAPortalHiloChat == 0) {
      IdChatbotIAPortalHiloChat =
        this.registroChatIA.IdChatbotIAPortalHiloChat!;
    }
    this.chatbotIAService
      .CerrarRegistroHiloChat(IdChatbotIAPortalHiloChat)
      .subscribe({
        next: (response) => {
          console.log(response);
          console.log('CERRANDO SESIÓN');
        },
        complete: () => {
          this.reiniciarChat();

          // this.enviarMensajeInicial();
        },
      });
  }
  ObtenerEstadoDerivacionHiloChat(IdContactoPortalSegmento: string) {
    this.ChatVentasAbierto;
    this.chatbotIAService
      .ObtenerEstadoDerivacionHiloChat(IdContactoPortalSegmento)
      .subscribe({
        next: (response) => {
          console.log('AREA DERIVADA ORIGEN', response);
          if (response != null) {
            if (
              response.idAreaDerivacion != 0 &&
              response.derivacionCerrada != 0
            ) {
              if (response.idAreaDerivacion == 2) {
                this.ChatbotCerrado = true;
                this.ChatVentasAbierto = true;
                console.log('Envia a flujo de VENTAS');
              }
              if (response.idAreaDerivacion == 1) {
                this.registroChatIA.IdMatriculaCabecera =
                  response.idMatriculaCabecera;
                this.ObtenerCoordinadorMatricula(
                  this.registroChatIA.IdMatriculaCabecera!
                );
                this.RegistroDirectoCursoMatriculado(false);

                this.ChatbotCerrado = true;
                this.ChatAcademicoAbierto = true;
                console.log('Envia a flujo de ');
              }
            }
          }
        },
      });
  }
  scrollAbajo(smooth: boolean = true, id: number) {
    console.log('Valor de scroll', id);
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
  ObtenerCursosMatriculadosAlumno(IdAlumno: number) {
    console.log('OBTENDRA LISTADO DE CURSOS');
    this.TieneCursosMatriculados = false;
    this.chatbotIAService
      .ObtenerCursosAlumnoMatriculado(IdAlumno)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          if (x.cursosHijo.length != 0) {
            this.TieneCursosMatriculados = true;
          }
        },
        complete: () => {
          if (this.TieneCursosMatriculados) {
            this.ActualizarIdAreaDerivacionHiloChat(1);
            this.ObtenerCoordinadorMatricula(
              this.registroChatIA.IdMatriculaCabecera!
            );
            this.RegistroDirectoCursoMatriculado(false);
          } else {
            this.ActualizarIdAreaDerivacionHiloChat(2);
            this.ChatbotCerrado = true;
            this.ChatVentasAbierto = true;
            console.log('INGRESO AL FLUJO 2');
          }
        },
      });
  }
  RegistroDirectoCursoMatriculado(EsSoporteTecnico: boolean) {
    this._ChatAtencionClienteService
      .ObtenerChatAtencionClienteContactoDetalleAcademico(
        this.registroChatIA.IdMatriculaCabecera!
      )
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.IdChatAtencionClienteContacto = x.idChatAtencionClienteContacto;
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
            console.log(x);
            this._HelperService
              .recibirMsjChat()
              .pipe(takeUntil(this.signal$))
              .subscribe({
                next: (x) => {
                  console.log(x);
                },
              });
            this.DatosCurso = x;
          },
          complete: () => {
            this.RegistroChatAtc.IdContactoPortalSegmento =
              this.registroChatIA.IdContactoPortalSegmento!;
            this.RegistroChatAtc.IdPGeneral = this.DatosCurso.idPGeneral;
            this.RegistroChatAtc.IdPEspecifico = this.DatosCurso.idPEspecifico;
            this.RegistroChatAtc.IdAlumno = this.DatosCurso.idAlumno;
            this.RegistroChatAtc.ChatIniciado = true;
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
}
