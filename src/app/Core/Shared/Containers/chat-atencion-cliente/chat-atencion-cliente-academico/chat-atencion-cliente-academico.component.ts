import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
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
import { ChatAtencionClienteService } from '../../../Services/ChatAtencionCliente/chat-atencion-cliente.service';

@Component({
  selector: 'app-chat-atencion-cliente-academico',
  templateUrl: './chat-atencion-cliente-academico.component.html',
  styleUrls: ['./chat-atencion-cliente-academico.component.scss']
})
export class ChatAtencionClienteAcademicoComponent implements OnInit, OnDestroy, OnChanges {
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
    private sanitizer: DomSanitizer,
    private _ChatAtencionClienteService:ChatAtencionClienteService
  ) {
    this.storageEventListener = this.handleStorageEvent.bind(this);
    window.addEventListener('storage', this.storageEventListener);
    localStorage.setItem('tabActive', 'true');
  }
  urlDoc: string = '';
  imagenesEnChat: any[] = [];
  pdfsEnChat: any[] = [];

  inputActive = false;
  mensajesAnteriorePrevio: any = [];
  mensajesAnteriore: any = [];
  public charge = false;
  public idcampania =
    this._SessionStorageService.SessionGetValue('idCampania') == ''
      ? '0'
      : this._SessionStorageService.SessionGetValue('idCampania');
  public chatKey = 'lcsk-chatId';
  @Input() idProgramageneral = 0;
  @Input() IdMatriculaCabecera = 0;
  public contadoraulavirtual = 0;
  public idInteraccion :any;
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
  public mensajeStateAsesor = 'no estoy disponible. Por favor deja un mensaje';
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
  public IdChatSesion:any;
  public IdMatriculaCabeceraPrincipal=this._SessionStorageService.SessionGetValue('IdMatriculaCabeceraPrincipal');
  public IdMatriculaCabeceraChat=this._SessionStorageService.SessionGetValue('IdMatriculaCabeceraPrincipal');
  public FechaRegistro:any;
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
    console.log('idProgramageneral', this.IdMatriculaCabecera)
    console.log(this._Router.url.split('/'));
    this.ObtenerConfiguracionChat();
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          console.log('SEGUNDO HELPER')
          var listprogramas = [9990, 9991, 9992];
          this.idProgramageneral =
            listprogramas[Math.floor(Math.random() * listprogramas.length)];
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
            .withUrl(this.urlSignal +'hubIntegraHub?idUsuario=11&&usuarioNombre=Anonimo&&rooms=633')
            .build();

          this.hubConnection.serverTimeoutInMilliseconds = 300000;
          this.hubConnection.serverTimeoutInMilliseconds = 36000000;

          this.ConectarSocket();
          this.hubConnection.onclose(() => {
            timer(5000)
              .pipe(takeUntil(this.signal$))
              .subscribe((_) => {
                this.ConectarSocket();
              });
          });
          this.onlineStatusAcademico();
          this.setChat();
          this.addMessagePAcademico();
          this.eliminaridchat();
          this.openChatWindow();
          this.marcarChatAlumnoComoLeidos();
          this.IdConnectionUser();
          this.setGuidAcademico();
          this.onlineStatusAcademicoIdChatSession();
          this.ObtenerCoordinadorChat();
          this.VerificarChatFinalizado();
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ObtenerCoordinadorChat();

    console.log('NGCHANGES', changes)
    console.log(this.IdMatriculaCabecera)
    if (this.Open && this.stateAsesor) {
      timer(1)
        .pipe(takeUntil(this.signal$))
        .subscribe((_) => {
          this.contenidoMsj.nativeElement.scrollTop =
            this.contenidoMsj.nativeElement.scrollHeight;
        });
    }
    this.IdMatriculaCabeceraChat=this._SessionStorageService.SessionGetValue('idCampania');
    if (this.IdMatriculaCabecera > 0) {
      this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalleAcademico(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          if(x!=null){
            this.FechaRegistro=x.fechaRegistro
          }
          else{
            this.FechaRegistro= new Date();
          }
          console.log(this.FechaRegistro)
        },
        complete:()=>{
          this.ObtenerDetalleChatPorIdInteraccionMatricula();
        }
      })
      this.ObtenerCoordinadorChat();
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
    this.GenerarLogVisitanteAulaVirtualAcademico();
  }

  //---------------------------------------------------------------------------------------------------------
  ObtenerCoordinadorChat() {
    this._ChatEnLinea
      .ObtenerCoordinadorChat(this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.ChargeChat.emit(true);
          var nombre1 = x.nombreAsesor.split(' ', 3);
          this.nombreasesorglobal = nombre1[0] + ' ' + nombre1[2];
          this.nombreAsesorSplit = this.nombreasesorglobal.split(' ', 2);
        },
      });
  }
  ObtenerConfiguracionChat() {
    this.clics = 0;
    this._ChatEnLinea
      .ObtenerConfiguracionChat()
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
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
    console.log(IdFaseOportunidadPortal)
    this.hubConnection
      .start()
      .then((x: any) => {
        if (this.hubConnection.state == 'Connected') {
          if (this.git == '') {
            console.log('Obtener el GUID Académico')
            this.hubConnection.invoke('getGuidAcademico',this.IdMatriculaCabecera,false);
          } else {
            this.GenerarLogVisitanteAulaVirtualAcademico();
          }
        }

        if (IdFaseOportunidadPortal != undefined) {
          this.actualizarDatosAlumno(IdFaseOportunidadPortal);
        }
      })
      .catch((err: any) => {});
  }

  setGuidAcademico() {
    this.hubConnection.on('setGuidAcademico', (Guid: any) => {
      console.log('Entro al setGuidAcademico', Guid);
      this.git = Guid;
      console.log(this.git)
      console.log('VA A GENERAR VISITANTE ACADEMICO')
      this.GenerarLogVisitanteAulaVirtualAcademico();
      console.log('SALIO GENERAR VISITANTE ACADEMICO')

    });
  }

  GenerarLogVisitanteAulaVirtualAcademico() {
    console.log('GENERARA UN GUID')
    let idProgramaGenetalEstatico = 0
    let cookiecontaco = this._SessionStorageService.SessionGetValue('usuarioWeb');
    this.hubConnection.invoke(
      'GenerarLogVisitanteAulaVirtualAcademico',
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
      this.idprogramageneralalumno,
      this.idcursoprogramageneralalumno,
      this.idcapitulo,
      this.idsesion,
      this.IdMatriculaCabecera,
      this.idcentrocosto,
      this.idcoordinadora,
      this.codigomatricula,
      this.git
    );
    console.log(
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
      this.idprogramageneralalumno,
      this.idcursoprogramageneralalumno,
      this.idcapitulo,
      this.idsesion,
      this.IdMatriculaCabecera,
      this.idcentrocosto,
      this.idcoordinadora,
      this.codigomatricula,
      this.git
    );

    console.log(this.IdAlumno);
    if (this.IdAlumno == null) {
      console.log('Recargo Funcion GenerarLogVisitanteAulaVirtualAcademico');

      this.GenerarLogVisitanteAulaVirtualAcademico();
    }
  }
  enviarMensajeVisitanteAcademico() {
    if (this.clics === 0) {
      this.GenerarLogVisitanteAulaVirtualAcademico();
      this.clics++;
      console.log('Clics ++  ' + this.clics);
    }
    if (this.chatBox != undefined && this.chatBox != null && this.chatBox.trim().length > 0) {
      this.hubConnection.invoke(
        'EnviarMensajeVisitanteAcademico',
        this.chatBox,
        this.git,
        this.IdChatSesion,
        this.IdMatriculaCabecera
      ).then(() => {
        this.NroMensajesSinLeer++;
        this.contenidoMsj.nativeElement.scrollTop =
        this.contenidoMsj.nativeElement.scrollHeight;
      }).catch((err:any) => console.error(err));
    }
    this.chatBox = '';
  }
  marcarChatAgentecomoleido() {
    this.hubConnection.invoke('marcarChatAcademicoComoLeido', this.idInteraccion);
  }
  actualizarDatosAlumno(IdFaseOportunidadPortal: any) {
    this.hubConnection.invoke(
      'actualizarDatosAlumnoAcademico',
      this.IdAlumno,
      IdFaseOportunidadPortal
    );
  }
  enviarMensajeVisitanteSoporteArchivo(
    url: string,
    idarchivo: number | null,
    tipo: string
  ) {
    this.hubConnection.invoke(
      'EnviarMensajeVisitanteAcademicoArchivoV2',
      url,
      this.idInteraccion,
      idarchivo,
      tipo
    );
  }
  ObtenerDetalleChatPorIdInteraccionMatricula() {
    this.charge = true;
    this.mensajesAnteriorePrevio=[];
    //Es false si se chat académico
    this._ChatDetalleIntegraService
      .ObtenerDetalleChatPorIdInteraccionMatricula(this.IdMatriculaCabecera,false)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.mensajesAnteriorePrevio = x;
          if (this.mensajesAnteriorePrevio.length > 0) {
            this.mensajesAnteriorePrevio.forEach((m: any) => {
              m.estadoEnviado = true;
            });
            // if (
            //   this.mensajesAnteriore[this.mensajesAnteriore.length - 1]
            //     .NroMensajesSinLeer != undefined
            // ) {
            //   this.NroMensajesSinLeer =
            //     this.mensajesAnteriore[
            //       this.mensajesAnteriore.length - 1
            //     ].NroMensajesSinLeer;
            // }
          }
          this.mensajesAnteriore=[];
          console.log(this.FechaRegistro)
          this.mensajesAnteriorePrevio.forEach((z:any)=>{
            console.log(z)
            if(z.Fecha>=this.FechaRegistro){
              this.mensajesAnteriore.push(z)
            }
          })
        },
        complete:()=>{
          this.mensajesAnteriore.push({
            NombreRemitente: this.nombreAsesorSplit[0],
            Mensaje: 'Bienvenido, ¿En qué puedo ayudarte?',
            IdRemitente: 'asesor',
          });
          timer(1000)
          .pipe(takeUntil(this.signal$))
          .subscribe((_) => {
            this.contenidoMsj.nativeElement.scrollTop =
              this.contenidoMsj.nativeElement.scrollHeight;
          });
        }
      });
  }
  setChat() {
    console.log(this.chatKey)
    this.hubConnection.on(
      'setChat',
      (id: any, agentName: any, existing: any) => {
        this.ChatID = id;
        const dataChatSesion = { id: id, IdMatriculaCabecera: this.IdMatriculaCabecera };
        this._SessionStorageService.SessionSetValueSesionStorage(
          this.chatKey,JSON.stringify(dataChatSesion)
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
          }
        }
      }
    );
    console.log(this.stateAsesor)
    console.log(this.ChatID)
  }
  onlineStatusAcademico() {
    this.hubConnection.on('onlineStatusAcademico', (data: any) => {
      console.log('Datos recibidos:', data);
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
      console.log('Estado Logeo:', this.estadoLogueo);
      this.estadoLogueo = data.estadologueo;
      this.chatRefreshState(this.stateAsesor, this.estadoLogueo, data.correo);
    });
  }

  IdConnectionUser() {
    this.hubConnection.on('IdConnectionUser', (id: any) => {
      console.log('Nueva Funcion IdConnectionUser', id);
    });
  }

  addMessagePAcademico() {
    this.hubConnection.on(
      'addMessagePAcademico',
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
        }

      }
    )
    timer(2500).pipe(takeUntil(this.signal$)).subscribe(_=>{
      this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
    })
  }
  eliminaridchat() {
    this.hubConnection.on('eliminaridchat', (x: any) => {
      // this.ChatID = null;
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
    this.selectedFiles =[];
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
              // this.idInteraccion = this.GetsesionIdInteraccion();
              console.log(this.idInteraccion)
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
              }
            },
            complete:()=>{
              timer(2500).pipe(takeUntil(this.signal$)).subscribe((_) => {
                this.contenidoMsj.nativeElement.scrollTop = this.contenidoMsj.nativeElement.scrollHeight;
            });
            }
          });
      } else {
        console.log(
          `Archivo no válido: ${name}. Solo se permiten archivos 'png', 'jpg', 'jpeg', 'jfif', 'pdf' , 'xlsx', 'xls', 'docx' y 'doc'.`
        );
      }
    }
  }
  GetsesionIdInteraccion() {
    let IdSesionChat=''
    const storedDataString = this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey);
    if(storedDataString){
      const storedData = JSON.parse(storedDataString);
      IdSesionChat = storedData.id;
      const storedIdMatriculaCabecera = storedData.IdMatriculaCabecera;
      console.log('Datos recuperados:');
      console.log('id:', IdSesionChat);
      console.log('IdMatriculaCabecera:', storedIdMatriculaCabecera);
    }
    if (IdSesionChat == ''
    ) {
      return '';
    } else {

      return IdSesionChat;
    }
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
  onlineStatusAcademicoIdChatSession() {
    this.hubConnection.on('onlineStatusAcademicoIdChatSession', (Guid: any) => {
      console.log('ESTE ES EL ID DE LA SESIÓN',Guid)
      this.IdChatSesion=Guid;
      this.idInteraccion=Guid
    });
  }
  VerificarChatFinalizado(){
    console.log('INGRESARÁ setFinalizarChat')
    this.hubConnection.on('setFinalizarChat', (IdMatriculaCabecera: number, EsSoporteTecnico: boolean, EsAcademico: boolean) => {
      console.log('INGRESARÁ setFinalizarChat');
      console.log('IdMatriculaCabecera:', IdMatriculaCabecera);
      console.log('EsAcademico:', EsAcademico);
      console.log('EsSoporteTecnico:', EsSoporteTecnico);
      this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado','false');
      window.location.reload()
    });
  }

}

