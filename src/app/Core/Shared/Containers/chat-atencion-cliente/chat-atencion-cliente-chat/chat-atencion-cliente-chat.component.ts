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
    private _ChatAtencionClienteService:ChatAtencionClienteService
  ) { }


  inputActive=false;
  mensajesAnteriore:any=[];
  public charge=false
  public idcampania=this._SessionStorageService.SessionGetValue("idCampania")==''?'0':(this._SessionStorageService.SessionGetValue("idCampania"));
  public chatKey = 'lcsk-chatId';
 // public listprogramas = [9990, 9991, 9992, 9993];
  @Input() idProgramageneral=0;
  @Input() IdPespecificoPrograma=0;
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
  public IdContactoPortalSegmento:any;
  public RegistroHistoricoUsuario:any
  public RespuestaConexion:ChatAtcFormularioEnviadoDTO={
    id:"",
    idAlumno:0
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.idProgramageneral)
    this.ObtenerAsesorVentas();
    if(this.Open && this.stateAsesor){

      timer(1).pipe(takeUntil(this.signal$)).subscribe(_=>{
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      })
    }
    if(this.idProgramageneral>0){
      timer(3000).pipe(takeUntil(this.signal$)).subscribe(_=>{
        var IdPGeneralChatAtc = this._SessionStorageService.SessionGetValue('IdPGeneralChatAtc');
        var IdPEspecificoChatAtc = this._SessionStorageService.SessionGetValue('IdPEspecificoChatAtc');
        console.log(this.idProgramageneral)
        console.log(IdPGeneralChatAtc)
        console.log(IdPEspecificoChatAtc)
        if(Number(IdPGeneralChatAtc)==this.idProgramageneral){
          if(IdPEspecificoChatAtc!='' && this.IdPespecificoPrograma!=0){
            this.IdPespecificoPrograma=Number(IdPEspecificoChatAtc)
            console.log(this.IdPespecificoPrograma)
          }
        }
      })

      //this.ChargeChat.emit(true)
    }
  }
  ngOnInit(): void {

    this.ObtenerAsesorVentas();
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
        this.eliminaridchat();
        this.openChatWindow();
        this.marcarChatAlumnoComoLeidos();
        this.ObtenerAsesorVentas();
        this.VerificarChatFinalizado()
      }
    })

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
          idRemitente:"asesor"
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

      timer(1).pipe(takeUntil(this.signal$)).subscribe(_=>{
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      })
    }else{
      this.mensajeStateAsesor='no estoy disponible. Por favor deja un mensaje'
    }
  }
  addMessageP(){
    this.hubConnection.on("addMessageP",(from:any, msg:any, flagfrom:any)=>{

      if (flagfrom == 2)//es asesor
      {
        let audio=new Audio('https://integrav4.bsginstitute.com/Content/sounds/newmsg.mp3')
        audio.play();
        this.mensajesAnteriore.push({
          nombreRemitente:this.nombreAsesorSplit[0],
          mensaje:msg,
          idRemitente:"asesor"
        })
      }
      if(flagfrom == 1){
        this.mensajesAnteriore.push({
          nombreRemitente:this.nombres,
          mensaje:msg,
          idRemitente:"visitante"
        })
        this.NroMensajesSinLeer++;
      }

      timer(25000).pipe(takeUntil(this.signal$)).subscribe(_=>{
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      })
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
            idRemitente:"asesor"
          })
        }
      }
    })
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

    this._ChatDetalleIntegraService.AdjuntarArchivoChatSoporte(this.selectedFiles.item(0)).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.idInteraccion=this.GetsesionIdInteraccion();
        this.mensajeChatArchivoAdjunto(x.Url, x.IdArchivo, x.Tipo)
      },
      complete:()=>{
        timer(2500).pipe(takeUntil(this.signal$)).subscribe((_) => {
            this.contenidoMsj.nativeElement.scrollTop = this.contenidoMsj.nativeElement.scrollHeight;
        });
      }
    })
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
  ampliarImagen(url:string){
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
          var nombre1 = x.nombreAsesor.split(' ', 3);
          this.nombreasesorglobal = nombre1[0] + ' ' + nombre1[2];
          this.nombreAsesorSplit = this.nombreasesorglobal.split(' ', 2);
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
          this.mensajesAnteriore = x;
        },
        complete:()=>{
          if (this.mensajesAnteriore.length > 0) {
            timer(2000).pipe(takeUntil(this.signal$)).subscribe(_=>{
              this.RespuestaConexion.id = this.mensajesAnteriore[0].idFaseOportunidadPortalWeb
              this.RespuestaConexion.idAlumno = this.mensajesAnteriore[0].idAlumno
              console.log(this.RespuestaConexion)
              this.actualizarDatosAlumno(this.RespuestaConexion)
            })

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
          timer(100)
          .pipe(takeUntil(this.signal$))
          .subscribe((_) => {
            this.contenidoMsj.nativeElement.scrollTop =
              this.contenidoMsj.nativeElement.scrollHeight;
          });
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
      window.location.reload()
    });
  }
}
