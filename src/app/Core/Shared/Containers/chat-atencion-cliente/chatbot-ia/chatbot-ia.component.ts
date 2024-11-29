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

  @ViewChild('contenidoMsj') contentChatMsj!: ElementRef;
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
    private _ChatEnLinea: ChatEnLineaService
  ) {}

  ngOnInit(): void {
    this.ObtenerHistorialChatBotIA()
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  reiniciarChat() {
    this.mensajes = [];
    this.registroChatIA = {
      Cerrado: false,
      Derivado: false,
    };
    this.ChatError = false;
    this.inputActive = true;
    this.nuevoMensaje = '';
    this.enviarMensajeInicial();
  }

  //Abre el chat e inicia con el mensaje inicial
  toggleChat(state: boolean) {
    this.Open = state;
    this.IsOpen.emit(state);
    if (this.Open && this.mensajes.length == 0) {

      this.enviarMensajeInicial();
    }

  }

  enviarMensaje(): void {
    if (this.nuevoMensaje.trim() && this.inputActive) {
      this.inputActive = false;

      this.mensajes.push({ esUsuario: true, mensaje: this.nuevoMensaje });
      this.registroChatIA.Mensaje = this.nuevoMensaje;
      this.registroChatIA.TiempoActual = new Date();
      this.nuevoMensaje = '';

      this.mostrarEscribiendo();

      this.enviarYProcesar(() => {
        this.reemplazarMensajeBot();
        this.inputActive = this.registroChatIA.Cerrado ? false : true;
        this.setFocusOnInput();
        this.scrollAbajo();
        if (this.registroChatIA.Derivado) {
          setTimeout(() => {
            if (
              this.registroChatIA.ChatDerivado == 1 &&
              this.registroChatIA.IdMatriculaCabecera != null &&
              this.registroChatIA.IdPGeneral != null
            ) {
              this.ActualizarIdAreaDerivacionHiloChat(this.registroChatIA.ChatDerivado);
              this.ObtenerCoordinadorMatricula(
                this.registroChatIA.IdMatriculaCabecera!
              );
            }
            if (this.registroChatIA.ChatDerivado == 2) {
              this.ActualizarIdAreaDerivacionHiloChat(this.registroChatIA.ChatDerivado);
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
      this.mensajes.push({
        mensaje: this.registroChatIA.Mensaje ?? '',
        esUsuario: false,
      });
      this.inputActive = true;

      this.CargandoInformacion = false;
      this.scrollAbajo();
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
              callback();
            } else {
              this.ChatError = true;
              this.CargandoInformacion = false;
            }
          },
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
    console.log('ACTUALIZAR');
    //this.scrollAbajo();
    this.cd.detectChanges();
    if(this.Open){
      this.scrollAbajo();
    }
  }

  //Enfoca el scroll abajo para ver el último mensaje
  scrollAbajo(): void {
    console.log("LO BAJARÁ")
    try {
      console.log(this.contentChatMsj)
      if (this.contentChatMsj) {
        console.log(this.contentChatMsj.nativeElement.scrollTop)
        console.log(this.contentChatMsj.nativeElement.scrollHeight)
        this.contentChatMsj.nativeElement.scrollTop =
          this.contentChatMsj.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error en enfocar el scrolling para bajo:', err);
    }
  }

  //Enfoca al input luego de recibir el mensaje
  private setFocusOnInput(): void {
    setTimeout(() => {
      this.inputChat.nativeElement.focus();
    }, 0);
  }

  // Muestra 'Escribiendo...'  para que el usuario sepa que no se ha colgado
  mostrarEscribiendo(): void {
    this.mensajes.push({ mensaje: 'Escribiendo...', esUsuario: false });
    this.scrollAbajo();
  }

  // Reemplaza el último mensaje del bot (los "...")
  reemplazarMensajeBot(): void {
    this.mensajes[this.mensajes.length - 1].mensaje =
      this.registroChatIA.Mensaje!;
    this.scrollAbajo();
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
  ObtenerHistorialChatBotIA(){
    this.mensajes=[]
    this.intervalPrevio = setTimeout(() => {
      var usuarioWeb =
        this._SessionStorageService.SessionGetValue('usuarioWeb');
      if (usuarioWeb != '') {
        clearTimeout(this.intervalPrevio);
        this.registroChatIA.IdContactoPortalSegmento = usuarioWeb;
        this.ObtenerEstadoDerivacionHiloChat(this.registroChatIA.IdContactoPortalSegmento)
        this.chatbotIAService.ObtenerHistorialMensajeUsuarioHiloChat(this.registroChatIA.IdContactoPortalSegmento).subscribe({
          next: (response) => {
            console.log('Historial del chat:',response);
            //Realiza el inicio de sesión del usuario
            if(response!=null)
              response.forEach((historial:any) => {
                this.mensajes.push({
                  mensaje: historial.contenido,
                  esUsuario: historial.esUsuario
                });
              });{

            }

          },
          error: (e) => {
            console.error('Error al obtener el historial respuesta de la API', e);
            this.ChatError = true;
          },
        });
      }
    }, 1000);
  }
  ActualizarIdAreaDerivacionHiloChat(IdAreaDerivacion:number){
    console.log('AREA DERIVADA',IdAreaDerivacion)
    this.chatbotIAService.ActualizarIdAreaDerivacionHiloChat(this.registroChatIA.IdChatbotIAPortalHiloChat!,IdAreaDerivacion).subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }
  CerrarRegistroHiloChat(){
    this.chatbotIAService.CerrarRegistroHiloChat(this.registroChatIA.IdChatbotIAPortalHiloChat!).subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }
  ObtenerEstadoDerivacionHiloChat(IdContactoPortalSegmento:string){
    this.chatbotIAService.ObtenerEstadoDerivacionHiloChat(IdContactoPortalSegmento).subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }
}
