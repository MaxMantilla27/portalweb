import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, takeUntil } from 'rxjs';
import { datosAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import { ChatDetalleIntegraService } from '../../Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { ChatEnLineaService } from '../../Services/ChatEnLinea/chat-en-linea.service';
import { GlobalService } from '../../Services/Global/global.service';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chat-portal',
  templateUrl: './chat-portal.component.html',
  styleUrls: ['./chat-portal.component.scss']
})
export class ChatPortalComponent implements OnInit,OnDestroy,OnChanges {
  private signal$ = new Subject();
  @ViewChild('contenidoMsj') contenidoMsj!: ElementRef;
  public hubConnection: any;
  constructor(
    private _ChatDetalleIntegraService:ChatDetalleIntegraService,
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService,
    private _GlobalService:GlobalService,
    private _ChatEnLinea: ChatEnLineaService,
  ) { }


  inputActive=false;
  mensajesAnteriore:any=[];
  public charge=false
  public idcampania=this._SessionStorageService.SessionGetValue("idCampania")==''?'0':(this._SessionStorageService.SessionGetValue("idCampania"));
  public chatKey = 'lcsk-chatId';
 // public listprogramas = [9990, 9991, 9992, 9993];
  @Input() idProgramageneral=0;
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
  @Output()
  ChargeChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  AbrirChat: EventEmitter<void> = new EventEmitter<void>();
  @Input() Open=false;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.Open && this.stateAsesor){
      setTimeout(() => {
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      }, 1);
    }
    if(this.idProgramageneral>0){

      //this.ChargeChat.emit(true)
    }
  }
  ngOnInit(): void {
    this.ObtenerConfiguracionChat();
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        var CodigoIso=this._SessionStorageService.SessionGetValue('ISO_PAIS')
        x.forEach((p:any) => {
          if(p.codigoIso==CodigoIso){
            this.idPais=p.idPais
          }
        });
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(this.urlSignal+"hubIntegraHub?idUsuario=11&&usuarioNombre=Anonimo&&rooms=633").build();

        this.ConectarSocket();
        this.hubConnection.onclose(() => {
          setTimeout(()=>{
            this.ConectarSocket();
          },10000)
        });

        this.configuracion();
        this.setChat();
        this.onlineStatus();
        this.addMessageP();
        this.eliminaridchat();
        this.openChatWindow();
        this.marcarChatAlumnoComoLeidos();
      }
    })

  }
  ObtenerConfiguracionChat(){
    this._ChatEnLinea.ObtenerConfiguracionChat().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.configuration=x
      }
    })
  }
  GetsesionIdInteraccion(){
    console.log(this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey))
    if(this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey)==''){
      return '';
    }else{
      return this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey)
    }
  }

  ObtenerIdAlumnoPorUsuario(IdFaseOportunidadPortal?:string){
    this._GlobalService.ObtenerIdAlumnoPorUsuario().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)

        if(x!=null && x.idAlumno!=null && x.idAlumno>0){

          var listprogramas = [9990, 9991, 9992, 9993];
          this.idProgramageneral=listprogramas[Math.floor(Math.random() * listprogramas.length)]
          this.IdAlumno=x.idAlumno
          this.idPais=x.idPais==-1?0:x.idPais
          this.nombres=x.nombres
          this.apellidos=x.apellidos
          this.email=x.correo
          this.telefono=x.telefono
          this.estadoLogueo="true"
          this.generarLogVisitante()

          if(IdFaseOportunidadPortal!=undefined){
            this.actualizarDatosAlumno(IdFaseOportunidadPortal);
          }

        }else{
          this.estadoLogueo="false"
        }

      }
    })
  }
  ConectarSocket(IdFaseOportunidadPortal?:string){
    this.hubConnection.start()
      .then((x:any) =>{
        //this.generarLogVisitante()
      })
      .catch((err:any) =>console.log('Error while starting connection: ' + err));
  }

  generarLogVisitante(){

    var cookiecontaco = this._SessionStorageService.SessionGetValue("usuarioWeb")
    console.log(cookiecontaco)
    console.log(this.hubConnection)

    this.hubConnection.invoke(
      "generarLogVisitante",
      document.location.href, document.referrer, "Arequipa", "Arequipa", "Peru",
      cookiecontaco, this.idProgramageneral, this.idPais, this.estadoLogueo, this.nombres, this.apellidos,
      this.email,this.telefono, 0, 0, this.IdAlumno, this.idcampania
    )
  }
  actualizarDatosAlumno(IdFaseOportunidadPortal:any){
    this.hubConnection.invoke("actualizarDatosAlumno",this.IdAlumno,IdFaseOportunidadPortal);
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
      console.log(NombreAsesor+'--'+estado);
      if(estado==false){
        this.ChargeChat.emit(false)
      }else{
        var nombre1 = NombreAsesor.split(" ", 3);
        this.nombreasesorglobal = nombre1[0] + " " + nombre1[2];
        this.nombreAsesorSplit=this.nombreasesorglobal.split(' ',2)
        this.ChargeChat.emit(true)
      }
    })
  }
  onlineStatus(){
    this.hubConnection.on("onlineStatus",(data:any)=>{
      console.log(data);
      if(data.status==true){
        if(data.nombreasesor===undefined){
          data.nombreasesor="";
        }

        data.nombreasesor = data.nombreasesor == 'Carmen del Rosario Cantoral  Cantoral' ? 'Carmen Cantoral' : data.nombreasesor;
        this.correoasesorglobal=data.correoasesor
      }
      if(this.mensajesAnteriore.length==0){
        this.mensajesAnteriore.push({
          NombreRemitente:"",
          Mensaje:this.configuration.textoInicial,
          IdRemitente:"asesor"
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

      setTimeout(() => {
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      }, 1);
    }else{
      this.mensajeStateAsesor='no estoy disponible. Por favor deja un mensaje'
    }
  }
  addMessageP(){
    this.hubConnection.on("addMessageP",(from:any, msg:any, flagfrom:any)=>{
      console.log(from+'--'+msg+'--'+flagfrom);
      console.log(this.nombres)
      if (flagfrom == 2)//es asesor
      {
        let audio=new Audio('https://integrav4.bsginstitute.com/Content/sounds/newmsg.mp3')
        audio.play();
        this.mensajesAnteriore.push({
          NombreRemitente:"",
          Mensaje:msg,
          IdRemitente:"asesor"
        })
      }
      if(flagfrom == 1){
        this.mensajesAnteriore.push({
          NombreRemitente:this.nombres,
          Mensaje:msg,
          IdRemitente:"visitante"
        })
        this.NroMensajesSinLeer++;
      }

      setTimeout(() => {
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      }, 100);
    })
  }
  eliminaridchat(){
    this.hubConnection.on("eliminaridchat",(x:any)=>{
      this.ChatID=null
    })
  }
  setChat(){
    this.hubConnection.on("setChat",(id:any, agentName:any, existing:any)=>{
      console.log(id+'--'+agentName+'--'+existing);
      this.ChatID=id
      this._SessionStorageService.SessionSetValueSesionStorage(this.chatKey,id)
      if (existing) {
        this.AbrirChat.emit()
      }
      if(!this.stateAsesor){
        this.msjEnviado=this.configuration.textoSatisfaccionOffline
        if(this.mensajesAnteriore.length==0){
          this.mensajesAnteriore.push({
            NombreRemitente:"",
            Mensaje:this.configuration.textoInicial,
            IdRemitente:"asesor"
          })
          // this.mensajesAnteriore.push({
          //   NombreRemitente:this.nombres,
          //   Mensaje:this.lastMsj,
          //   IdRemitente:"visitante"
          // })
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
      console.log(x);
      this.NroMensajesSinLeer=-1
    })
  }

  AgregarArchivoChatSoporte(event:any){
    for (var i = 0; i < event.target.files.length; i++) {
      var name = event.target.files[i].name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>150){
        // this.fileErrorMsg='El tamaño del archivo no debe superar los 150 MB'
        // this.filestatus=false
      }
      this.selectedFiles = event.target.files;
      this.AdjuntarArchivoChatSoporte()
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  AdjuntarArchivoChatSoporte(){

    this._ChatDetalleIntegraService.AdjuntarArchivoChatSoporte(this.selectedFiles.item(0)).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
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
    })
  }

  enviarmsj(){
    this.idInteraccion=this.GetsesionIdInteraccion();
    if (this.idInteraccion == null || this.idInteraccion == '') {
      this.mensajeChat()
    }else{
      this.enviarMensajeVisitante();
    }
    this.chatBox="";
  }
  ampliarImagen(url:string){
    console.log(url)
  }
}