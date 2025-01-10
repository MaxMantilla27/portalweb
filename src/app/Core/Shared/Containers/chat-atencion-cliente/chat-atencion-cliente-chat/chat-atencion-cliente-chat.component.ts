import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, takeUntil, timer } from 'rxjs';
import { datosAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import { ChatDetalleIntegraService } from '../../../Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { ChatEnLineaService } from '../../../Services/ChatEnLinea/chat-en-linea.service';
import { GlobalService } from '../../../Services/Global/global.service';
import { SessionStorageService } from '../../../Services/session-storage.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HelperService } from '../../../Services/helper.service';
import { ChatAtencionClienteService } from '../../../Services/ChatAtencionCliente/chat-atencion-cliente.service';
import { ChatAtcFormularioEnviadoDTO } from 'src/app/Core/Models/ChatAtencionClienteDTO';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-chat-atencion-cliente-chat',
  templateUrl: './chat-atencion-cliente-chat.component.html',
  styleUrls: ['./chat-atencion-cliente-chat.component.scss']
})
export class ChatAtencionClienteChatComponent implements OnInit,OnDestroy,OnChanges {
  private signal$ = new Subject();
  @ViewChild('contenidoMsj') contenidoMsj!: ElementRef;
  public hubConnection: any;
  constructor(
    private _ChatDetalleIntegraService:ChatDetalleIntegraService,
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService,
    private _GlobalService:GlobalService,
    private _ChatEnLinea: ChatEnLineaService,
    private _ChatAtencionClienteService:ChatAtencionClienteService,
    private sanitizer: DomSanitizer,
  ) { }

  pdfsEnChat: any[] = [];

  inputActive=false;
  mensajesAnteriorePrevio: any = [];
  mensajesAnteriore:any=[];
  public charge=false
  public idcampania=this._SessionStorageService.SessionGetValue("idCampania")==''?'0':(this._SessionStorageService.SessionGetValue("idCampania"));
  public chatKey = 'lcsk-chatId';
 // public listprogramas = [9990, 9991, 9992, 9993];
  @Input() idProgramageneral=0;
  @Input() IdPespecificoPrograma=0;
  @Output() RegresarChatAtc = new EventEmitter<boolean>();
  @Output() RegresarChatAtcEnviado = new EventEmitter<boolean>();
  public showConfirmationDialog = false;

  public contadoraulavirtual=0
  public idInteraccion =this.GetsesionIdInteraccion()
  public idprogramageneralalumno=0
  public idcursoprogramageneralalumno=0
  public idcapitulo=0
  public idsesion=0
  public idMatriculaCabecera=0
  public idcentrocosto=0
  public idcoordinadora=0
  public codigomatricula=""
  public IdAlumno=0;
  public chatBox=""
  public idPais=0
  public nombreasesorglobal=''
  public nombreAsesorSplit:string[]=[];
  public nombres=''
  public apellidos=''
  public email=''
  public telefono=''
  public correoasesorglobal=''
  public estadoLogueo="false"
  public stateAsesor=false
  public mensajeStateAsesor='no estoy disponible. Por favor deja un mensaje'
  public NroMensajesSinLeer=0;
  public ChatID:any;
  public selectedFiles:any
  public urlSignal=environment.url_signal
  public msjEnviado='';
  public configuration:any
  public lastMsj=''
  public img='https://proceso-pago.bsginstitute.com/img-web/chatV2/'
  @Output()
  ChargeChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  AbrirChat: EventEmitter<void> = new EventEmitter<void>();
  @Input() Open=false;
  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  public IdContactoPortalSegmento:any;
  public RegistroHistoricoUsuario:any
  public RespuestaConexion:ChatAtcFormularioEnviadoDTO={
    id:"",
    idAlumno:0
  }
  public ReiniciarFlujoChat=false;
  public archivoenviado: any;
  public imagenMostrada: boolean = false;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.idProgramageneral)
    this.ObtenerAsesorVentas();
    if(this.Open && this.stateAsesor){

      this.scrollAbajo(true,1)

    }


    if(this.idProgramageneral>0){
      // timer(5000).pipe(takeUntil(this.signal$)).subscribe(_=>{
      //   var IdPGeneralChatAtc = this._SessionStorageService.SessionGetValue('IdPGeneralChatAtc');
      //   var IdPEspecificoChatAtc = this._SessionStorageService.SessionGetValue('IdPEspecificoChatAtc');
      //   console.log(this.idProgramageneral)
      //   console.log(IdPGeneralChatAtc)
      //   console.log(IdPEspecificoChatAtc)
      //   if(Number(IdPGeneralChatAtc)==this.idProgramageneral){
      //     if(IdPEspecificoChatAtc!='' && this.IdPespecificoPrograma!=0){
      //       this.IdPespecificoPrograma=Number(IdPEspecificoChatAtc)
      //       console.log(this.IdPespecificoPrograma)
      //     }
      //   }
      // })

      //this.ChargeChat.emit(true)
    }
  }
  ngOnInit(): void {

    // this.ObtenerAsesorVentas();
    var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      let nombresArray = datos.nombres.split(" ");
      this.nombres = nombresArray[0];
    }
    this.IdContactoPortalSegmento=this._SessionStorageService.SessionGetValue('usuarioWeb')
    console.log(this.IdContactoPortalSegmento)
    this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalle(this.IdContactoPortalSegmento,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.RegistroHistoricoUsuario=x
        console.log(x)
      },
      complete:()=>{
        if(this.RegistroHistoricoUsuario.formularioEnviado){
          this.estadoLogueo="true";
          this.ObtenerDetalleChatPorIdInteraccionContactoPortalSegmento()
        }
      }
    })
    this.ObtenerConfiguracionChat();
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        var CodigoIso=this._SessionStorageService.SessionGetValue('ISO_PAIS')
        x.forEach((p:any) => {
          if(p.codigoIso==CodigoIso){
            this.idPais=p.idPais
          }
        });
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(this.urlSignal+"hubIntegraHub?idUsuario=11&&usuarioNombre=Anonimo&&rooms=633").build();

        this.hubConnection.serverTimeoutInMilliseconds = 300000;
        this.hubConnection.serverTimeoutInMilliseconds = 36000000;

        this.ConectarSocket();

        this.hubConnection.onclose(() => {

          timer(5000).pipe(takeUntil(this.signal$)).subscribe(_=>{
            this.ConectarSocket();
          })
        });

        this.configuracion();
        this.setChat();
        this.onlineStatus();
        this.addMessageP();
        this.openChatWindow();
        this.marcarChatAlumnoComoLeidos();
        // this.ObtenerAsesorVentas();
        this.VerificarChatFinalizado()
      }
    })
    console.log('MENSAJES HISTORICOS',this.mensajesAnteriore)
  }
  ObtenerConfiguracionChat(){
    this._ChatEnLinea.ObtenerConfiguracionChat().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.configuration=x
        console.log(this.configuration)
      }
    })
  }
  GetsesionIdInteraccion(){
    return this.ChatID;
    console.log(this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey))
    if(this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey)==''){
      return '';
    }else{
      return this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey)
    }
  }

  ConectarSocket(){
    this.hubConnection.start().then((x:any) =>{
      if(this.hubConnection.state=='Connected'){
        this.generarLogVisitanteAtc()
      }
    })
    .catch((err:any) =>{});
  }

  generarLogVisitanteAtc(){

    var cookiecontaco = this._SessionStorageService.SessionGetValue("usuarioWeb")

    this.hubConnection.invoke(
      "generarLogVisitanteAtc",
      document.location.href, document.referrer, "Arequipa", "Arequipa", "Peru",
      cookiecontaco, this.idProgramageneral, this.idPais, this.estadoLogueo, this.nombres, this.apellidos,
      this.email,this.telefono, 0, 0, this.IdAlumno, this.idcampania
    ).then((response:any) => {
      // Maneja la respuesta aquí
      console.log("Respuesta de generarLogVisitanteAtc:", response);
    }).catch((error:any) => {
        // Maneja el error aquí
        console.error("Error al invocar generarLogVisitanteAtc:", error);
    });

  }
  actualizarDatosAlumno(respuesta:any){

    this.estadoLogueo="true"
    console.log(respuesta.idAlumno)
    console.log(respuesta.id)
    this.hubConnection.invoke(
      "ActualizarDatosAlumno",
      respuesta.idAlumno,respuesta.id
    ).then((response:any) => {
      // Maneja la respuesta aquí
      console.log("Respuesta de generarLogVisitanteAtc:", response,respuesta.idAlumno,respuesta.id);
    }).catch((error:any) => {
        // Maneja el error aquí
        console.error("Error al invocar generarLogVisitanteAtc:", error);
    });
  }

  mensajeChat(){
    this.hubConnection.invoke("mensajeChat",this.chatBox)
  }
  enviarMensajeVisitante(){
    this.hubConnection.invoke("enviarMensajeVisitante",this.chatBox)
  }

  marcarChatAgentecomoleido(){
    this.hubConnection.invoke("marcarChatAgentecomoleido",this.idInteraccion);
  }
  crearChatOffline(){
    this.hubConnection.invoke("crearChatOffline",this.chatBox,this.idProgramageneral,this.idPais);
    this.lastMsj=this.chatBox;
    this.chatBox="";
  }
  enviarMensajeVisitanteSoporteArchivo(url:string,idarchivo:number|null,tipo:string){
    this.hubConnection.invoke("enviarMensajeVisitanteSoporteArchivo",url,this.idInteraccion,idarchivo,tipo);
  }
  mensajeChatArchivoAdjunto(url:string,idarchivo:number|null,tipo:string){
    this.hubConnection.invoke("mensajeChatArchivoAdjunto",url,idarchivo,tipo);
  }
  configuracion(){
    this.hubConnection.on("configuracion",(NombreAsesor:any, estado:any)=>{
      if(NombreAsesor=="Sin Asignar"){
        NombreAsesor="Sin Asesor Asesor"
      }
      console.log(NombreAsesor)
      console.log(estado)
      var nombre1 = NombreAsesor.split(" ", 3);
        this.nombreasesorglobal = nombre1[0] + " " + nombre1[2];
        this.nombreAsesorSplit=this.nombreasesorglobal.split(' ',2)
        this.img='https://proceso-pago.bsginstitute.com/img-web/chatV2/'
        this.img+=this.nombreAsesorSplit[0]+'-'+this.nombreAsesorSplit[1]+'.png'
        this.ChargeChat.emit(true)
    })
  }
  onlineStatus(){
    this.hubConnection.on("onlineStatus",(data:any)=>{
      if(data.status==true){
        if(data.nombreasesor===undefined){
          data.nombreasesor="";
        }

        data.nombreasesor = data.nombreasesor == 'Carmen del Rosario Cantoral  Cantoral' ? 'Carmen Cantoral' : data.nombreasesor;
        this.correoasesorglobal=data.correoasesor
      }
      if(this.mensajesAnteriore.length==0){
        this.mensajesAnteriore.push({
          nombreRemitente:"",
          mensaje:this.configuration.textoInicial,
          idRemitente:"asesor",
          fechaEnvio: this.ObtenerHoraActual()
        })
      }
      this.stateAsesor=data.status
     // this.estadoLogueo=data.estadologueo
      this.chatRefreshState(this.stateAsesor,this.estadoLogueo,data.correo)
    })
  }
  chatRefreshState(state?:boolean, estadologueo?:string, correo?:string){
    if(state){
      this.mensajeStateAsesor='¿En qué puedo ayudarte?'

      this.scrollAbajo(true,2)

    }else{
      this.mensajeStateAsesor='no estoy disponible. Por favor deja un mensaje'
    }
  }
  ReiniciarChat(){
    console.log('REINICIA EL CHAAAAAAAAAAAT')
    this.showConfirmationDialog = true;
    this.ReiniciarFlujoChat=true;
  }
  addMessageP(){
    let inactivityTimeout: any; // Variable para el temporizador de inactividad

    const startInactivityTimer = () => {
      clearTimeout(inactivityTimeout); // Reinicia el temporizador si ya estaba corriendo
      console.log('INICIA EL CONTEO');
      inactivityTimeout = setTimeout(() => {
        this.ReiniciarChat(); // Llama a la función cerrar() si pasan 3 minutos sin respuesta
      }, 3 * 60 * 1000); // 3 minutos
    };
    this.hubConnection.on("addMessageP",(from:any, msg:any, flagfrom:any)=>{

      if (flagfrom == 2)//es asesor
      {
        let audio=new Audio('https://integrav4.bsginstitute.com/Content/sounds/newmsg.mp3')
        audio.play();
        this.mensajesAnteriore.push({
          nombreRemitente:this.nombreAsesorSplit[0],
          mensaje:msg,
          idRemitente:"asesor",
          fechaEnvio: this.ObtenerHoraActual()
        })
        // Inicia o reinicia el temporizador de inactividad
        startInactivityTimer();
      }
      if(flagfrom == 1){
        this.mensajesAnteriore.push({
          nombreRemitente:this.nombres,
          mensaje:msg,
          idRemitente:"visitante",
          fechaEnvio: this.ObtenerHoraActual()
        })
        this.NroMensajesSinLeer++;
        // Detiene el temporizador porque el visitante respondió
        clearTimeout(inactivityTimeout);
      }

      this.scrollAbajo(true,3)

    })
  }
  eliminaridchat(){
    this.hubConnection.on("eliminaridchat",(x:any)=>{
      this.ChatID=null
    })
  }
  setChat(){
    this.hubConnection.on("setChat",(id:any, agentName:any, existing:any)=>{
      this.ChatID=id
      this._SessionStorageService.SessionSetValueSesionStorage(this.chatKey,id)
      if (existing) {
        this.AbrirChat.emit()
      }
      if(!this.stateAsesor){
        this.msjEnviado=this.configuration.textoSatisfaccionOffline
        if(this.mensajesAnteriore.length==0){
          this.mensajesAnteriore.push({
            nombreRemitente:"",
            mensaje:this.configuration.textoInicial,
            idRemitente:"asesor",
            fechaEnvio: this.ObtenerHoraActual()
          })
        }
      }
    })
  console.log('Idddddd de la sesión',this.ChatID)

  }
  openChatWindow(){
    this.hubConnection.on("openChatWindow",(x:any)=>{
      this.AbrirChat.emit()
    })
  }
  marcarChatAlumnoComoLeidos(){
    this.hubConnection.on("marcarChatAlumnoComoLeidos",(x:any)=>{

      this.NroMensajesSinLeer=-1
    })
  }

  AgregarArchivoChatSoporte(event:any){
    this.selectedFiles=[]
    for (var i = 0; i < event.target.files.length; i++) {
      var name = event.target.files[i].name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>150){
        // this.fileErrorMsg='El tamaño del archivo no debe superar los 25 MB'
        // this.filestatus=false
      }
      this.selectedFiles = event.target.files;
      this.AdjuntarArchivoChatSoporte()
    }
  }
  AdjuntarArchivoChatSoporte(){
    const allowedExtensions = [
      'png',
      'jpg',
      'pdf',
      'doc',
      'docx',
      'jpeg',
      'jfif',
      'xlsx',
      'xls',
    ];

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
              console.log(this.idInteraccion);
              this.mensajeChatArchivoAdjunto(url, idArchivo, tipo)
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
              } else if (
                ['pdf', 'doc', 'docx', 'xlsx', 'xls'].includes(extension)
              ) {
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
            complete: () => {
              this.scrollAbajo(true, 8);

            },
          });
      } else {
        console.log(
          `Archivo no válido: ${name}. Solo se permiten archivos 'png', 'jpg', 'jpeg', 'jfif', 'pdf' , 'xlsx', 'xls', 'docx' y 'doc'.`
        );
      }
    }
  }
  imagenUrlActual: string = '';
  mostrarImagenEnChat(imagenUrl: string) {
    if (imagenUrl) {
      this.imagenUrlActual = imagenUrl;
    }
  }
  enviarmsj(){
    console.log(this.chatBox)
    if(this.chatBox!=undefined && this.chatBox!='' && this.chatBox!=null ){
      this.idInteraccion=this.GetsesionIdInteraccion();
      console.log(this.idInteraccion)
      if (this.idInteraccion == null || this.idInteraccion == '') {
        this.mensajeChat()
      }else{
        this.enviarMensajeVisitante();
      }
      this.chatBox="";
    }
  }
  ErrorImgAsesor(){
    this.img='../../../../../assets/imagenes/174188.png'
  }
  ObtenerAsesorVentas() {
    this._ChatAtencionClienteService
      .ObtenerAsesorChatAtc(this.idPais,this.idProgramageneral)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.ChargeChat.emit(true);
          if(x!=null){
            var nombre1 = x.nombreAsesor.split(' ', 3);
            this.nombreasesorglobal = nombre1[0] + ' ' + nombre1[2];
            this.nombreAsesorSplit = this.nombreasesorglobal.split(' ', 2);
          }
          else{
            this.nombreasesorglobal = "Sin Asesor";
            this.nombreAsesorSplit = this.nombreasesorglobal.split(' ', 2);
          }
        },
      });
  }
  ObtenerDetalleChatPorIdInteraccionContactoPortalSegmento() {
    console.log('================BUSCAR HISTORIAL')
    console.log(this.IdContactoPortalSegmento)
    console.log(this.idProgramageneral)
    this.charge = true;
    this._ChatAtencionClienteService
      .ObtenerDetalleChatPorIdInteraccionContactoPortalSegmento(this.IdContactoPortalSegmento,this.idProgramageneral)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.mensajesAnteriorePrevio = x;
        },
        complete:()=>{
          if(this.mensajesAnteriorePrevio!=null){
            if (this.mensajesAnteriorePrevio.length > 0 ) {
              timer(2000).pipe(takeUntil(this.signal$)).subscribe(_=>{
                this.RespuestaConexion.id = this.mensajesAnteriorePrevio[0].idFaseOportunidadPortalWeb
                this.RespuestaConexion.idAlumno = this.mensajesAnteriorePrevio[0].idAlumno
                console.log(this.RespuestaConexion)
                this.actualizarDatosAlumno(this.RespuestaConexion)
              })
              this.mensajesAnteriorePrevio.forEach((z: any) => {
                const regex = /<img\s+[^>]*src="([^"]+)"[^>]*>/i;
                  z.esImagen = regex.test(z.Mensaje);
                  if(z.esImagen){
                    const match = z.Mensaje.match(regex);
                    z.url = match[1].trim();
                  }
                  const fecha = new Date(z.fecha); // Suponiendo que z.fecha es una fecha válida
                  z.fechaEnvio = this.formatearHoraPersonalizada(fecha);
                  z.estadoEnviado = true;
                  this.mensajesAnteriore.push(z);
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
              this.scrollAbajo(true,5)
            }
          }
          else{
            this.eliminaridchat();
          }

        }
      });
  }
  VerificarChatFinalizado(){
    console.log('INGRESARÁ setFinalizarChatComercial')
    this.hubConnection.on('setFinalizarChatComercial', (IdOportunidad: number, IdAlumno: number, IdPGeneral: number) => {
      console.log('INGRESARÁ setFinalizarChatComercial');
      console.log('IdOportunidad:', IdOportunidad);
      console.log('IdAlumno:', IdAlumno);
      console.log('IdPGeneral:', IdPGeneral);
      this._SessionStorageService.SessionSetValue('ReinicioChatBot','true');
      setTimeout(() => {
        window.location.reload()
      }, 4000);
    });
  }
  onAtrasChatAtc() {
    this.RegresarChatAtc.emit(true);  // Aquí puedes emitir true o false según necesites
  }
  onAtrasChatAtcEnviado() {
    this.RegresarChatAtcEnviado.emit(true);  // Aquí puedes emitir true o false según necesites
  }
  confirmAction() {
    this.showConfirmationDialog = true;
    this.RegresarChatAtcEnviado.emit(true);
  }
  confirmActionReset() {
    console.log('Confirmoooooooooreseteará')
    this._SessionStorageService.SessionSetValue('ReinicioChatBot', 'true');
    setTimeout(() => {
      window.location.reload()
    }, 100);
  }

  cancelAction() {
    this.showConfirmationDialog = false;
  }
  scrollAbajo(smooth: boolean = true,id:number) {
    console.log('Valor de scroll',id)
    setTimeout(() => {
    if (this.contenidoMsj) {
      const nativeElement = this.contenidoMsj.nativeElement;
      nativeElement.scrollTo({
        top: nativeElement.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }},100)
  }
  toggleChat(state: boolean) {
    this.Open = state;
    this.IsOpen.emit(state);
  }
  mostrarPDFEnChat(url: string) {
    const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.pdfsEnChat.push(pdfUrl);
  }
  ObtenerHoraActual(): string {
    const ahora = new Date();
    let hora: number = ahora.getHours();
    let minutos: number = ahora.getMinutes();
    const esAM: boolean = hora < 12;

    // Ajustar las horas para el formato de 12 horas
    hora = hora % 12 || 12; // Cambia 0 a 12 para las horas AM/PM
    const minutosStr: string = minutos.toString().padStart(2, '0'); // Asegura siempre 2 dígitos para minutos

    const sufijo: string = esAM ? 'am' : 'pm';
    return `${hora}:${minutosStr} ${sufijo}`;
  }
  ampliarImagen(url: string): void {
    window.open(url, '_blank');
  }
  formatearHoraPersonalizada(fecha: Date): string {
    let hora: number = fecha.getHours();
    let minutos: number = fecha.getMinutes();
    const esAM: boolean = hora < 12;

    // Ajustar las horas para el formato de 12 horas
    hora = hora % 12 || 12; // Cambia 0 a 12 para las horas AM/PM
    const minutosStr: string = minutos.toString().padStart(2, '0'); // Asegura siempre 2 dígitos para minutos

    const sufijo: string = esAM ? 'am' : 'pm';
    return `${hora}:${minutosStr} ${sufijo}`;
  }
}
