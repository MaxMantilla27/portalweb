import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild,
} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, takeUntil, timer } from 'rxjs';
import { datosAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import { ChatDetalleIntegraService } from '../../../Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { ChatEnLineaService } from '../../../Services/ChatEnLinea/chat-en-linea.service';
import { GlobalService } from '../../../Services/Global/global.service';
import { HelperService } from '../../../Services/helper.service';
import { SessionStorageService } from '../../../Services/session-storage.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-atencion-cliente-soporte',
  templateUrl: './chat-atencion-cliente-soporte.component.html',
  styleUrls: ['./chat-atencion-cliente-soporte.component.scss']
})
export class ChatAtencionClienteSoporteComponent implements OnInit, OnDestroy, OnChanges {
  private signal$ = new Subject();

  @ViewChild('contenidoMsj') contenidoMsj!: ElementRef;
  public hubConnection: any;
  private storageEventListener: (event: StorageEvent) => void;
  constructor(
    private _ChatDetalleIntegraService: ChatDetalleIntegraService,
    private _HelperService: HelperService,
    private _SessionStorageService: SessionStorageService,
    private _GlobalService: GlobalService,
    private _ChatEnLinea: ChatEnLineaService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.storageEventListener = this.handleStorageEvent.bind(this);
    window.addEventListener('storage', this.storageEventListener);
    localStorage.setItem('tabActive', 'true');
  }
  urlDoc: string = '';
  imagenesEnChat: any[] = [];
  pdfsEnChat: any[] = [];

  inputActive = false;
  mensajesAnteriore: any = [];
  public charge = false;
  public idcampania =
    this._SessionStorageService.SessionGetValue('idCampania') == ''
      ? '0'
      : this._SessionStorageService.SessionGetValue('idCampania');
  public chatKey = 'lcsk-chatId';
  // public listprogramas = [9990, 9991, 9992, 9993];
  @Input() idProgramageneral = 0;
  @Output() RegresarChatAcademico = new EventEmitter<boolean>();
  public showConfirmationDialog = false;

  public contadoraulavirtual = 0;
  public idInteraccion = this.GetsesionIdInteraccion();
  public idprogramageneralalumno = 0;
  public idcursoprogramageneralalumno = 0;
  public idcapitulo = 0;
  public idsesion = 0;
  public idMatriculaCabecera = 0;
  public idcentrocosto = 0;
  public idcoordinadora = 0;
  public codigomatricula = '';
  public IdAlumno = 0;
  public chatBox = '';
  public idPais = 0;
  public nombreasesorglobal = '';
  public nombreAsesorSplit: string[] = [];
  public nombres = '';
  public apellidos = '';
  public email = '';
  public telefono = '';
  public correoasesorglobal = '';
  public estadoLogueo = 'false';
  public stateAsesor = false;
  public mensajeStateAsesor = '';
  public NroMensajesSinLeer = -1;
  public ChatID: any;
  public selectedFiles: any;
  public urlSignal = environment.url_signal;
  public msjEnviado = '';
  public configuration: any;
  public lastMsj = '';
  public img = 'https://proceso-pago.bsginstitute.com/img-web/chatV2/';
  public git = '';
  private clics = 0;
  @Output()
  ChargeChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  AbrirChat: EventEmitter<void> = new EventEmitter<void>();
  @Input() Open = false;
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
    window.removeEventListener('storage', this.storageEventListener);
  }
  ngOnInit(): void {
    this.mensajesAnteriore=[]
    console.log('idProgramageneral', this.idProgramageneral)

    console.log(this._Router.url.split('/'));
    this.ObtenerConfiguracionChat();
    //this.ObtenerIdAlumnoPorUsuario(undefined)
    this._HelperService.recibirCombosPerfil
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          //var listprogramas = [9990, 9991, 9992, 9993];
          var listprogramas = [9990, 9991, 9992];
          this.idProgramageneral =
            listprogramas[Math.floor(Math.random() * listprogramas.length)];
          this.ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(
            x.datosAlumno.idAlumno
          );
          this.IdAlumno = x.datosAlumno.idAlumno;
          this.idPais =
            x.datosAlumno.idPais == -1 || x.datosAlumno.idPais == null
              ? 0
              : x.datosAlumno.idPais;
          this.nombres = x.datosAlumno.nombres;
          this.apellidos = x.datosAlumno.apellidos;
          this.email = x.datosAlumno.email;
          this.telefono = x.datosAlumno.telefono;
          this.estadoLogueo = 'true';

          this.hubConnection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(
              this.urlSignal +
                'hubIntegraHub?idUsuario=11&&usuarioNombre=Anonimo&&rooms=633'
            )
            .build();

          this.hubConnection.serverTimeoutInMilliseconds = 300000;
          this.hubConnection.serverTimeoutInMilliseconds = 36000000;

          this.ConectarSocket();
          this.hubConnection.onclose(() => {
            timer(10000)
              .pipe(takeUntil(this.signal$))
              .subscribe((_) => {
                this.ConectarSocket();
              });
          });

          this.configuracionSoporte();
          this.setChat();
          this.onlineStatus();
          this.addMessageP();
          this.eliminaridchat();
          this.openChatWindow();
          this.marcarChatAlumnoComoLeidos();
          this.IdConnectionUser();
          this.setGuid();
          this.onlineStatusSoporteIdChatSession();
        },
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.Open && this.stateAsesor) {
      timer(1)
        .pipe(takeUntil(this.signal$))
        .subscribe((_) => {
          this.contenidoMsj.nativeElement.scrollTop =
            this.contenidoMsj.nativeElement.scrollHeight;
        });
    }
    if (this.idProgramageneral > 0 && this.estadoLogueo == 'false') {
      this.ObtenerAsesorChat();
    }
  }

  //---------------------------------------------------------------------------------------------------------
  handleStorageEvent(event: StorageEvent) {
    if (event.key === 'tabActive') {
      // Verifica si el cambio proviene de otra pestaña
      if (event.newValue === null) {
        // Se activa cuando se abre una nueva pestaña de la misma página
        console.log('Nueva pestaña de la misma página');
        // Ejecuta la función que desees aquí
        this.doSomethingOnNewTab();
      }
    }
  }
  doSomethingOnNewTab() {
    this.GenerarLogVisitanteAulaVirtual();
  }

  //---------------------------------------------------------------------------------------------------------

  ObtenerAsesorChat() {
    this._ChatEnLinea
      .ObtenerAsesorChat(this.idProgramageneral)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.ChargeChat.emit(true);
          var nombre1 = x.nombreAsesor.split(' ', 3);
          console.log(x)
          this.nombreasesorglobal = nombre1[0] + ' ' + nombre1[2];
          this.nombreAsesorSplit = this.nombreasesorglobal.split(' ', 2);
        },
      });
  }
  enviarmsj() {
    this.NroMensajesSinLeer++;
    this.idInteraccion = this.GetsesionIdInteraccion();

    timer(100)
      .pipe(takeUntil(this.signal$))
      .subscribe((_) => {
        this.contenidoMsj.nativeElement.scrollTop =
          this.contenidoMsj.nativeElement.scrollHeight;
      });

    this.enviarMensajeVisitanteSoporte();
    this.chatBox = '';
  }
  enviarmsjOff() {
    this.idInteraccion = this.GetsesionIdInteraccion();
    if (this.idInteraccion == null || this.idInteraccion == '') {
      this.crearChatOffline();
    } else {
      this.crearChatOfflineSoporte();
    }
    this.chatBox = '';
  }
  ObtenerConfiguracionChat() {
    this.clics = 0;
    this._ChatEnLinea
      .ObtenerConfiguracionChat()
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.configuration = x;
        },
      });
  }
  ObtenerIdAlumnoPorUsuario(IdFaseOportunidadPortal?: any) {
    this._GlobalService
      .ObtenerIdAlumnoPorUsuario()
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if (x != null && x.idAlumno != null && x.idAlumno > 0) {
          } else {
            this.estadoLogueo = 'false';
          }
        },
      });
  }
  ConectarSocket(IdFaseOportunidadPortal?: string) {
    this.hubConnection
      .start()
      .then((x: any) => {
        if (this.hubConnection.state == 'Connected') {
          if (this.git == '') {
            this.hubConnection.invoke('getGuidSoporte',this.IdAlumno,true);
          } else {
            this.GenerarLogVisitanteAulaVirtual();
          }
        }

        if (IdFaseOportunidadPortal != undefined) {
          this.actualizarDatosAlumno(IdFaseOportunidadPortal);
        }
      })
      .catch((err: any) => {});
  }

  setGuid() {
    this.hubConnection.on('setGuidSoporte', (Guid: any) => {
      console.log('Entro al setGuidSoporte', Guid);
      this.git = Guid;
      console.log(this.git)
      console.log('VA A GENERAR VISITANTE ACADEMICO')
      this.GenerarLogVisitanteAulaVirtual();
      console.log('SALIO GENERAR VISITANTE ACADEMICO')

    });
  }

  GenerarLogVisitanteAulaVirtual() {
    let idProgramaGenetalEstatico = this._SessionStorageService.SessionGetValue('IdPGeneral') ? 0  : parseInt(this._SessionStorageService.SessionGetValue('IdPGeneral'));

    let existingChatId = this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey) ?? '';

    if (idProgramaGenetalEstatico == 0 || existingChatId == '') {
      idProgramaGenetalEstatico = this.idProgramageneral;
    }
    let cookiecontaco = this._SessionStorageService.SessionGetValue('usuarioWeb');
    this.hubConnection.invoke(
      'GenerarLogVisitanteAulaVirtual',
      document.location.href,
      document.referrer,
      'Arequipa',
      'Arequipa',
      'Peru',
      cookiecontaco,
      idProgramaGenetalEstatico,
      this.idPais,
      this.estadoLogueo,
      this.nombres,
      this.apellidos,
      this.email,
      this.telefono,
      0,
      0,
      this.IdAlumno,
      this.idcampania,
      this.contadoraulavirtual,
      this.idInteraccion,
      this.idprogramageneralalumno,
      this.idcursoprogramageneralalumno,
      this.idcapitulo,
      this.idsesion,
      this.idMatriculaCabecera,
      this.idcentrocosto,
      this.idcoordinadora,
      this.codigomatricula,
      this.git
    );
    console.log('GenerarLogVisitanteAulaVirtual',
      document.location.href,
      document.referrer,
      'Arequipa',
      'Arequipa',
      'Peru',
      cookiecontaco,
      idProgramaGenetalEstatico,
      this.idPais,
      this.estadoLogueo,
      this.nombres,
      this.apellidos,
      this.email,
      this.telefono,
      0,
      0,
      this.IdAlumno,
      this.idcampania,
      this.contadoraulavirtual,
      this.idInteraccion,
      this.idprogramageneralalumno,
      this.idcursoprogramageneralalumno,
      this.idcapitulo,
      this.idsesion,
      this.idMatriculaCabecera,
      this.idcentrocosto,
      this.idcoordinadora,
      this.codigomatricula,
      this.git)
    console.log(this.IdAlumno);
    if (this.IdAlumno == null) {
      console.log('Recargo Funcion GenerarLogVisitanteAulaVirtual');

      this.GenerarLogVisitanteAulaVirtual();
    }
  }
  enviarMensajeVisitanteSoporte() {
    if (this.clics === 0) {
      this.GenerarLogVisitanteAulaVirtual();
      console.log('Entro en clck para recarga ');
      this.clics++;
      console.log('Clics ++  ' + this.clics);
      if (this.chatBox != undefined && this.chatBox != null && this.chatBox.trim().length > 0) {
        this.hubConnection.invoke(
          'enviarMensajeVisitanteSoporteV2',
          this.chatBox,
          this.idInteraccion,
          this.git
        );
      }
    } else {
      console.log('No recargo denuevo aulavirtual ');
      if (this.chatBox != undefined && this.chatBox != null && this.chatBox.trim().length > 0) {
        this.hubConnection.invoke(
          'enviarMensajeVisitanteSoporteV2',
          this.chatBox,
          this.idInteraccion,
          this.git
        );
      }
    }
  }
  marcarChatAgentecomoleido() {
    this.hubConnection.invoke('marcarChatAgentecomoleido', this.idInteraccion);
  }
  actualizarDatosAlumno(IdFaseOportunidadPortal: any) {
    this.hubConnection.invoke(
      'actualizarDatosAlumno',
      this.IdAlumno,
      IdFaseOportunidadPortal
    );
  }
  crearChatOfflineSoporte() {
    var idProgramaGenetalEstatico = parseInt(
      this._SessionStorageService.SessionGetValue('IdPGeneral')
    );
    this.hubConnection.invoke(
      'crearChatOfflineSoporte',
      this.chatBox,
      idProgramaGenetalEstatico,
      this.idPais,
      this.idInteraccion
    );
  }
  crearChatOffline() {
    console.log('Entro al chat 2');
    var idProgramaGenetalEstatico = parseInt(
      this._SessionStorageService.SessionGetValue('IdPGeneral')
    );
    this.hubConnection.invoke(
      'crearChatOffline',
      this.chatBox,
      idProgramaGenetalEstatico,
      this.idPais
    );
  }
  enviarMensajeVisitanteSoporteArchivo(
    url: string,
    idarchivo: number | null,
    tipo: string
  ) {
    this.hubConnection.invoke(
      'EnviarMensajeVisitanteSoporteArchivoV2',
      url,
      this.idInteraccion,
      idarchivo,
      tipo
    );
  }
  ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(idAlumno: number) {
    this.charge = true;
    this._ChatDetalleIntegraService
      .ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(idAlumno)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.mensajesAnteriore = x;
          if (this.mensajesAnteriore.length > 0) {
            this.mensajesAnteriore.forEach((m: any) => {
              m.estadoEnviado = true;
            });
            if (
              this.mensajesAnteriore[this.mensajesAnteriore.length - 1]
                .NroMensajesSinLeer != undefined
            ) {
              this.NroMensajesSinLeer =
                this.mensajesAnteriore[
                  this.mensajesAnteriore.length - 1
                ].NroMensajesSinLeer;
            }
          }
        },
      });
  }
  configuracionSoporte() {
    this.hubConnection.on(
      'configuracionSoporte',
      (NombreAsesor: any, estado: any, idPGeneral: any) => {
        /*  console.log(NombreAsesor)
      console.log(this.idProgramageneral)
      console.log(idPGeneral) */
        if (estado == false) {
          if (this.contadoraulavirtual < 3) {
            if (this.idProgramageneral == 9990) {
              this.idProgramageneral = 9991;
            } else if (this.idProgramageneral == 9991) {
              this.idProgramageneral = 9992;
            } else if (this.idProgramageneral == 9992) {
              this.idProgramageneral = 9990;
            }
            // else if (this.idProgramageneral == 9993) {
            //   this.idProgramageneral = 9990;
            // }contadoraulavirtual = 4 EN CASO se agregue sera  +1
            this.contadoraulavirtual++;
            this.GenerarLogVisitanteAulaVirtual();
          } else {
            this.ChargeChat.emit(false);
          }
        } else {
          var nombre1 = NombreAsesor.split(' ', 3);
          this.nombreasesorglobal = nombre1[0] + ' ' + nombre1[2];
          this.nombreAsesorSplit = this.nombreasesorglobal.split(' ', 2);
          this.img =
            'https://proceso-pago.bsginstitute.com/img-web/chatV2/' +
            this.nombreAsesorSplit[0] +
            '-' +
            this.nombreAsesorSplit[1] +
            '.png';
          this._SessionStorageService.SessionSetValue('IdPGeneral', idPGeneral);
          this.ChargeChat.emit(true);
        }
      }
    );
  }
  setChat() {
    this.hubConnection.on(
      'setChat',
      (id: any, agentName: any, existing: any) => {
        this.ChatID = id;
        this._SessionStorageService.SessionSetValueSesionStorage(
          this.chatKey,
          id
        );
        if (existing) {
          this.AbrirChat.emit();
        }

        if (!this.stateAsesor) {
          this.msjEnviado = this.configuration.textoSatisfaccionOffline;
          if (this.mensajesAnteriore.length == 0) {
            this.mensajesAnteriore.push({
              NombreRemitente: '',
              Mensaje: this.configuration.textoInicial,
              IdRemitente: 'asesor',
            });
            // this.mensajesAnteriore.push({
            //   NombreRemitente:this.nombres,
            //   Mensaje:this.lastMsj,
            //   IdRemitente:"visitante"
            // })
          }
        }
      }
    );
  }
  onlineStatus() {
    this.hubConnection.on('onlineStatus', (data: any) => {
      if (data.status == true) {
        if (data.nombreasesor === undefined) {
          data.nombreasesor = '';
        }

        data.nombreasesor =
          data.nombreasesor == 'Carmen del Rosario Cantoral  Cantoral'
            ? 'Carmen Cantoral'
            : data.nombreasesor;
        this.correoasesorglobal = data.correoasesor;
      }
      this.stateAsesor = data.status;
      this.estadoLogueo = data.estadologueo;
      this.chatRefreshState(this.stateAsesor, this.estadoLogueo, data.correo);
    });
  }

  IdConnectionUser() {
    this.hubConnection.on('IdConnectionUser', (id: any) => {
      console.log('Nueva Funcion IdConnectionUser', id);
    });
  }

  addMessageP() {
    this.hubConnection.on(
      'addMessageP',
      (from: any, msg: any, flagfrom: any) => {
        if (flagfrom == 2) {
          //es asesor
          let audio = new Audio(
            'https://integrav4.bsginstitute.com/Content/sounds/newmsg.mp3'
          );
          audio.play();
          if (
            this.archivoenviado != undefined &&
            this.archivoenviado != null &&
            this.archivoenviado.Mensaje == msg
          ) {
            this.mensajesAnteriore.push(this.archivoenviado);
            this.archivoenviado = null;
          } else {
            this.mensajesAnteriore.push({
              NombreRemitente: this.nombreAsesorSplit[0],
              Mensaje: msg,
              IdRemitente: 'asesor',
              estadoEnviado: true,
            });
          }
        }
        if (flagfrom == 1) {
          this.mensajesAnteriore.push({
            NombreRemitente: this.nombres,
            Mensaje: msg,
            IdRemitente: 'visitante',
            estadoEnviado: true,
          });
          /* this.mensajesAnteriore.forEach((m:any) => {
          if(m.estadoEnviado==false){
            if(m.Mensaje==msg){
              m.estadoEnviado=true
            }
          }
        }); */
          // this.mensajesAnteriore.push({
          //   NombreRemitente:this.nombres,
          //   Mensaje:msg,
          //   IdRemitente:"visitante"
          // })
        }

        timer(2500)
          .pipe(takeUntil(this.signal$))
          .subscribe((_) => {
            this.contenidoMsj.nativeElement.scrollTop =
              this.contenidoMsj.nativeElement.scrollHeight;
          });
      }
    );
  }
  eliminaridchat() {
    this.hubConnection.on('eliminaridchat', (x: any) => {
      this.ChatID = null;
    });
  }
  openChatWindow() {
    console.log('Entro al chat');
    this.hubConnection.on('openChatWindow', (x: any) => {
      this.AbrirChat.emit();
    });
  }
  marcarChatAlumnoComoLeidos() {
    this.hubConnection.on('marcarChatAlumnoComoLeidos', (x: any) => {
      this.NroMensajesSinLeer = -1;
    });
  }
  chatRefreshState(state?: boolean, estadologueo?: string, correo?: string) {
    if (state) {
      this.mensajeStateAsesor = '¿En qué puedo ayudarte?';

      timer(1)
        .pipe(takeUntil(this.signal$))
        .subscribe((_) => {
          this.contenidoMsj.nativeElement.scrollTop =
            this.contenidoMsj.nativeElement.scrollHeight;
        });
    } else {
      this.mensajeStateAsesor =
        'no estoy disponible. Por favor deja un mensaje';
    }
  }
  AgregarArchivoChatSoporte(event: any) {
    this.selectedFiles=[]
    for (var i = 0; i < event.target.files.length; i++) {
      var name = event.target.files[i].name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion = name.split('.')[name.split('.').length - 1];
      if (Math.round(size / 1024 / 1024) > 150) {
        // this.fileErrorMsg='El tamaño del archivo no debe superar los 25 MB'
        // this.filestatus=false
      }
      this.selectedFiles = event.target.files;
      this.AdjuntarArchivoChatSoporte();
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }

  public archivoenviado: any;
  public imagenMostrada: boolean = false;
  AdjuntarArchivoChatSoporte() {
    const allowedExtensions = ['png', 'jpg', 'pdf','doc', 'docx','jpeg','jfif', 'xlsx', 'xls'];

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      const name = file.name;
      const extension = name.split('.').pop().toLowerCase();


      if (allowedExtensions.includes(extension)) {
        this._ChatDetalleIntegraService
          .AdjuntarArchivoChatSoporte(file)
          .pipe(takeUntil(this.signal$))
          .subscribe({
            next: (x) => {
              const url = x.Url;
              const idArchivo = x.IdArchivo;
              const tipo = x.Tipo;
              this.idInteraccion = this.GetsesionIdInteraccion();
              this.enviarMensajeVisitanteSoporteArchivo(url, idArchivo, tipo);


              if (['png', 'jpg', 'jpeg', 'jfif'].includes(extension)) {
                 // Crear un nuevo objeto de mensaje para la imagen
                 const newImageMessage = {
                  NombreRemitente: this.nombres,
                  Mensaje: 'Imagen enviada con éxito',
                  IdRemitente: 'visitante', // Suponiendo que es un mensaje del visitante
                  estadoEnviado: true,
                  url: url, // Almacenar la URL de la imagen
                  tipo: tipo, // Almacenar el tipo de imagen (p.ej., 'png', 'jpg')
                  idArchivo: idArchivo, // Almacenar el ID de la imagen si es necesario
                  esImagen: true, // Propiedad personalizada para indicar que es una imagen
                };
                this.archivoenviado = newImageMessage;
                if (!this.imagenMostrada) {
                  this.mostrarImagenEnChat(url); // Corrige esto para usar la URL correcta
                  this.imagenMostrada = true;
                }
                // Push the new image message into your messages array
                // this.mensajesAnteriore.push(newImageMessage);
              } else if (['pdf', 'doc', 'docx', 'xlsx', 'xls'].includes(extension)) {
                // Crear un nuevo objeto de mensaje para el documento
                const newDocMessage = {
                  NombreRemitente: this.nombres,
                  Mensaje: 'Archivo enviado: ' + name, // Puedes personalizar el texto del mensaje
                  IdRemitente: 'visitante', // Suponiendo que es un mensaje del visitante
                  estadoEnviado: true,
                  url: url, // Almacenar la URL del documento
                  tipo: tipo, // Almacenar el tipo de documento (p.ej., 'pdf', 'doc')
                  idArchivo: idArchivo, // Almacenar el ID del documento si es necesario
                };
                this.archivoenviado = newDocMessage;
                // this.mensajesAnteriore.push(newDocMessage);
              }
            },
            complete:()=>{
              timer(2500).pipe(takeUntil(this.signal$)).subscribe((_) => {
                this.contenidoMsj.nativeElement.scrollTop = this.contenidoMsj.nativeElement.scrollHeight;
            })
            }
          });
      } else {
        console.log(
          `Archivo no válido: ${name}. Solo se permiten archivos 'png', 'jpg', 'jpeg', 'jfif', 'pdf' , 'xlsx', 'xls', 'docx' y 'doc'.`
        );
      }
    }
    /*  this._ChatDetalleIntegraService.AdjuntarArchivoChatSoporte(this.selectedFiles.item(0)).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.idInteraccion=this.GetsesionIdInteraccion();
        if (this.idInteraccion == null || this.idInteraccion == '') {
          this.mensajeChatArchivoAdjunto(x.Url, x.IdArchivo, x.Tipo)
        }else{
          this.enviarMensajeVisitanteSoporteArchivo(x.Url, x.IdArchivo, x.Tipo);
        }
        // if (x.type === HttpEventType.UploadProgress) {
        //   // this.progress = Math.round(100 * x.loaded / x.total);
        //   // console.log(this.progress)
        // } else if (x instanceof HttpResponse) {
        //   // this.progress=0;
        //   if(x.body==true){

        //   }else{
        //     // this._SnackBarServiceService.openSnackBar("Solo tiene 2 intentos para subir su proyecto.",'x',15,"snackbarCrucigramaerror");
        //   }
        // }
      }
    })*/
  }
  GetsesionIdInteraccion() {
    if (
      this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey) ==
      ''
    ) {
      return '';
    } else {
      return this._SessionStorageService.SessionGetValueSesionStorage(
        this.chatKey
      );
    }
  }
  BuscarProgramas(esButton: boolean) {
    var obj: any;
    if (esButton) {
      obj = {
        Tag: 'Button',
        Nombre: 'Enviar>',
        valor: this.chatBox,
        Seccion: 'Chat',
      };
    } else {
      obj = {
        Tag: 'Input',
        Accion: 'keyup.enter',
        Tipo: 'text',
        Nombre: 'Chat',
        valor: this.chatBox,
        Seccion: 'Chat',
      };
    }
    this._HelperService.enviarMsjAcciones(obj);
  }
  imagenUrlActual: string = '';
  mostrarImagenEnChat(imagenUrl: string) {
    if (imagenUrl) {
      this.imagenUrlActual = imagenUrl;
    }
  }
  mostrarPDFEnChat(url: string) {
    const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.pdfsEnChat.push(pdfUrl);
  }
  ErrorImgAsesor() {
    this.img = '../../../../../assets/imagenes/174188.png';
  }
  onlineStatusSoporteIdChatSession() {
    this.hubConnection.on('onlineStatusSoporteIdChatSession', (Guid: any) => {
      console.log('ESTE ES EL ID DE LA SESIÓN',Guid)
      this.idInteraccion=Guid
    });
  }
  VerificarChatFinalizado(){
    this.hubConnection.on('setFinalizarChat', (IdMatriculaCabecera: number, EsAcademico: boolean, EsSoporteTecnico: boolean) => {
      console.log()
      this._SessionStorageService.SessionSetValue('ReinicioChatBot','true');
      setTimeout(() => {
        window.location.reload()
      }, 4000);
    });
  }
  RetrocederCursosAlumno(){
    this.RegresarChatAcademico.emit(true);
  }
  confirmAction() {
    this.showConfirmationDialog = false;
    this.RegresarChatAcademico.emit(true);
  }

  cancelAction() {
    this.showConfirmationDialog = false;
  }
}