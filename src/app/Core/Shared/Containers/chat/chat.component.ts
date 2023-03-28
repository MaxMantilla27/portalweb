import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, takeUntil, timer } from 'rxjs';
import { datosAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import { ChatDetalleIntegraService } from '../../Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { ChatEnLineaService } from '../../Services/ChatEnLinea/chat-en-linea.service';
import { GlobalService } from '../../Services/Global/global.service';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,OnDestroy,OnChanges {
  private signal$ = new Subject();

  @ViewChild('contenidoMsj') contenidoMsj!: ElementRef;
  public hubConnection: any;
  constructor(
    private _ChatDetalleIntegraService:ChatDetalleIntegraService,
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService,
    private _GlobalService:GlobalService,
    private _ChatEnLinea: ChatEnLineaService,
    private _ActivatedRoute:ActivatedRoute,
    private _Router:Router
  ) {

  }

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
  public NroMensajesSinLeer=-1;
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
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    this._HelperService.recibirMsjChat().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        if(x.idMatriculaCabecera!=undefined){
          this.idMatriculaCabecera=x.idMatriculaCabecera
        }
        if(x.idcentrocosto!=undefined){
          this.idcentrocosto=x.idcentrocosto
        }
        if(x.idcoordinadora!=undefined){
          this.idcoordinadora=x.idcoordinadora
        }
        if(x.idcursoprogramageneralalumno!=undefined){
          this.idcursoprogramageneralalumno=x.idcursoprogramageneralalumno
        }
        if(x.idprogramageneralalumno!=undefined){
          this.idprogramageneralalumno=x.idprogramageneralalumno
        }
        if(x.idcapitulo!=undefined){
          this.idcapitulo=x.idcapitulo
        }
        if(x.idsesion!=undefined){
          this.idsesion=x.idsesion
        }
        if(this.hubConnection.state=='Connected'){
          this.GenerarLogVisitanteAulaVirtual()
        }

      }
    })
    console.log(this._Router.url.split('/'));
    this.ObtenerConfiguracionChat();
    //this.ObtenerIdAlumnoPorUsuario(undefined)
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        var listprogramas = [9990, 9991, 9992, 9993];
        this.idProgramageneral=listprogramas[Math.floor(Math.random() * listprogramas.length)]
        this.ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(x.datosAlumno.idAlumno)
        this.IdAlumno=x.datosAlumno.idAlumno
        this.idPais=(x.datosAlumno.idPais==-1 || x.datosAlumno.idPais==null)?0:x.datosAlumno.idPais
        this.nombres=x.datosAlumno.nombres
        this.apellidos=x.datosAlumno.apellidos
        this.email=x.datosAlumno.email
        this.telefono=x.datosAlumno.telefono
        this.estadoLogueo="true"

        this.hubConnection = new signalR.HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(this.urlSignal+"hubIntegraHub?idUsuario=11&&usuarioNombre=Anonimo&&rooms=633").build();


        this.hubConnection.serverTimeoutInMilliseconds = 300000;
        this.hubConnection.serverTimeoutInMilliseconds = 36000000;


        this.ConectarSocket();
        this.hubConnection.onclose(() => {
          timer(10000).pipe(takeUntil(this.signal$)).subscribe(_=>{
            this.ConectarSocket();
          })
        });

        this.configuracionSoporte();
        this.setChat();
        this.onlineStatus();
        this.addMessageP();
        this.eliminaridchat();
        this.openChatWindow();
        this.marcarChatAlumnoComoLeidos();
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.Open && this.stateAsesor){
      timer(1).pipe(takeUntil(this.signal$)).subscribe(_=>{
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      })
    }
    if(this.idProgramageneral>0 && this.estadoLogueo=="false"){
      this.ObtenerAsesorChat();
    }
  }

  ObtenerAsesorChat(){
    this._ChatEnLinea.ObtenerAsesorChat(this.idProgramageneral).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.ChargeChat.emit(true)
        var nombre1 = x.nombreAsesor.split(" ", 3);
        this.nombreasesorglobal = nombre1[0] + " " + nombre1[2];
        this.nombreAsesorSplit=this.nombreasesorglobal.split(' ',2)
      }
    })
  }
  enviarmsj(){
    this.mensajesAnteriore.push({
      NombreRemitente:this.nombres,
      Mensaje:this.chatBox,
      IdRemitente:"visitante",
      estadoEnviado:false
    })

    this.NroMensajesSinLeer++;
    this.idInteraccion=this.GetsesionIdInteraccion();

    timer(100).pipe(takeUntil(this.signal$)).subscribe(_=>{
      this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
    })

    if (this.idInteraccion == null || this.idInteraccion == '') {
      this.mensajeChat()
    }else{
      this.enviarMensajeVisitanteSoporte();
    }
    this.chatBox="";
  }
  enviarmsjOff(){
    this.idInteraccion=this.GetsesionIdInteraccion();
    if (this.idInteraccion == null || this.idInteraccion == '') {
      this.crearChatOffline()
    }else{
      this.crearChatOfflineSoporte();
    }
    this.chatBox="";
  }
  ObtenerConfiguracionChat(){
    this._ChatEnLinea.ObtenerConfiguracionChat().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.configuration=x
      }
    })
  }
  ObtenerIdAlumnoPorUsuario(IdFaseOportunidadPortal?:any){
    this._GlobalService.ObtenerIdAlumnoPorUsuario().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{

        if(x!=null && x.idAlumno!=null && x.idAlumno>0){



        }else{
          this.estadoLogueo="false"
        }

      }
    })
  }
  ConectarSocket(IdFaseOportunidadPortal?:string){
    this.hubConnection.start()
      .then((x:any) =>{
        if(this.hubConnection.state=='Connected'){
          this.GenerarLogVisitanteAulaVirtual()
        }

        if(IdFaseOportunidadPortal!=undefined){
          this.actualizarDatosAlumno(IdFaseOportunidadPortal);
        }
      })
      .catch((err:any) =>{});
  }

  GenerarLogVisitanteAulaVirtual(){

    var idProgramaGenetalEstatico =
      this._SessionStorageService.SessionGetValue("IdPGeneral")==''
      ?0
      :parseInt(this._SessionStorageService.SessionGetValue("IdPGeneral"));

    var existingChatId = this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey);
    if(idProgramaGenetalEstatico==0 || existingChatId==''){
      idProgramaGenetalEstatico=this.idProgramageneral;
    }
    var cookiecontaco = this._SessionStorageService.SessionGetValue("usuarioWeb")
    this.hubConnection.invoke(
      "GenerarLogVisitanteAulaVirtual",
      document.location.href, document.referrer, "Arequipa", "Arequipa", "Peru",
      cookiecontaco, idProgramaGenetalEstatico, this.idPais, this.estadoLogueo, this.nombres, this.apellidos,
      this.email,this.telefono, 0, 0, this.IdAlumno, this.idcampania, this.contadoraulavirtual, this.idInteraccion,
      this.idprogramageneralalumno, this.idcursoprogramageneralalumno, this.idcapitulo, this.idsesion, this.idMatriculaCabecera, this.idcentrocosto,
      this.idcoordinadora, this.codigomatricula
    )
  }

  mensajeChat(){
    this.hubConnection.invoke("mensajeChat",this.chatBox)
  }
  enviarMensajeVisitanteSoporte(){
    this.hubConnection.invoke("enviarMensajeVisitanteSoporte",this.chatBox,this.idInteraccion)
  }
  marcarChatAgentecomoleido(){
    this.hubConnection.invoke("marcarChatAgentecomoleido",this.idInteraccion);
  }
  actualizarDatosAlumno(IdFaseOportunidadPortal:any){
    this.hubConnection.invoke("actualizarDatosAlumno",this.IdAlumno,IdFaseOportunidadPortal);
  }
  crearChatOfflineSoporte(){
    var idProgramaGenetalEstatico = parseInt(this._SessionStorageService.SessionGetValue("IdPGeneral"));
    this.hubConnection.invoke("crearChatOfflineSoporte",this.chatBox,idProgramaGenetalEstatico,this.idPais,this.idInteraccion);
  }
  crearChatOffline(){
    var idProgramaGenetalEstatico = parseInt(this._SessionStorageService.SessionGetValue("IdPGeneral"));
    this.hubConnection.invoke("crearChatOffline",this.chatBox,idProgramaGenetalEstatico,this.idPais);
  }
  enviarMensajeVisitanteSoporteArchivo(url:string,idarchivo:number|null,tipo:string){
    this.hubConnection.invoke("enviarMensajeVisitanteSoporteArchivo",url,this.idInteraccion,idarchivo,tipo);
  }
  mensajeChatArchivoAdjunto(url:string,idarchivo:number|null,tipo:string){
    this.hubConnection.invoke("mensajeChatArchivoAdjunto",url,idarchivo,tipo);
  }
  ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(idAlumno:number){
    this.charge=true
    this._ChatDetalleIntegraService.ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(idAlumno).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.mensajesAnteriore=x
        if(this.mensajesAnteriore.length>0){
          this.mensajesAnteriore.forEach((m:any) => {
            m.estadoEnviado=true
          });
          if(this.mensajesAnteriore[this.mensajesAnteriore.length-1].NroMensajesSinLeer!=undefined){
            this.NroMensajesSinLeer=this.mensajesAnteriore[this.mensajesAnteriore.length-1].NroMensajesSinLeer

          }
        }

      }
    })
  }
  configuracionSoporte(){
    this.hubConnection.on("configuracionSoporte",(NombreAsesor:any, estado:any, idPGeneral:any)=>{
      console.log(NombreAsesor)
      console.log(this.idProgramageneral)
      console.log(idPGeneral)
      if(estado==false){
        if(this.contadoraulavirtual<4){
          if (this.idProgramageneral == 9990) {
            this.idProgramageneral = 9991;
          }
          else if (this.idProgramageneral == 9991) {
            this.idProgramageneral = 9992;
          }
          else if (this.idProgramageneral == 9992) {
            this.idProgramageneral = 9993;
          }
          else if (this.idProgramageneral == 9993) {
            this.idProgramageneral = 9990;
          }
          this.contadoraulavirtual++
          this.GenerarLogVisitanteAulaVirtual();
        }else{
          this.ChargeChat.emit(false)
        }
      }else{
        var nombre1 = NombreAsesor.split(" ", 3);
        this.nombreasesorglobal = nombre1[0] + " " + nombre1[2];
        this.nombreAsesorSplit=this.nombreasesorglobal.split(' ',2)
        this.img='https://proceso-pago.bsginstitute.com/img-web/chatV2/'+this.nombreAsesorSplit[0]+'-'+this.nombreAsesorSplit[1]+'.png'
        this._SessionStorageService.SessionSetValue("IdPGeneral",idPGeneral);
        this.ChargeChat.emit(true)
      }
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
            NombreRemitente:"",
            Mensaje:this.configuration.textoInicial,
            IdRemitente:"asesor",
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
  onlineStatus(){
    this.hubConnection.on("onlineStatus",(data:any)=>{
      if(data.status==true){
        if(data.nombreasesor===undefined){
          data.nombreasesor="";
        }

        data.nombreasesor = data.nombreasesor == 'Carmen del Rosario Cantoral  Cantoral' ? 'Carmen Cantoral' : data.nombreasesor;
        this.correoasesorglobal=data.correoasesor
      }
      this.stateAsesor=data.status
      this.estadoLogueo=data.estadologueo
      this.chatRefreshState(this.stateAsesor,this.estadoLogueo,data.correo)
    })
  }
  addMessageP(){
    this.hubConnection.on("addMessageP",(from:any, msg:any, flagfrom:any)=>{
      if (flagfrom == 2)//es asesor
      {
        let audio=new Audio('https://integrav4.bsginstitute.com/Content/sounds/newmsg.mp3')
        audio.play();
        this.mensajesAnteriore.push({
          NombreRemitente:this.nombreAsesorSplit[0],
          Mensaje:msg,
          IdRemitente:"asesor",
          estadoEnviado:true
        })
      }
      if(flagfrom == 1){
        this.mensajesAnteriore.forEach((m:any) => {
          if(m.estadoEnviado==false){
            if(m.Mensaje==msg){
              m.estadoEnviado=true
            }
          }
        });
        // this.mensajesAnteriore.push({
        //   NombreRemitente:this.nombres,
        //   Mensaje:msg,
        //   IdRemitente:"visitante"
        // })
      }

      timer(100).pipe(takeUntil(this.signal$)).subscribe(_=>{
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      })
    })
  }
  eliminaridchat(){
    this.hubConnection.on("eliminaridchat",(x:any)=>{
      this.ChatID=null
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
  AgregarArchivoChatSoporte(event:any){
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
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  AdjuntarArchivoChatSoporte(){

    this._ChatDetalleIntegraService.AdjuntarArchivoChatSoporte(this.selectedFiles.item(0)).pipe(takeUntil(this.signal$)).subscribe({
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
    })
  }
  GetsesionIdInteraccion(){
    if(this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey)==''){
      return '';
    }else{
      return this._SessionStorageService.SessionGetValueSesionStorage(this.chatKey)
    }
  }
  BuscarProgramas(esButton:boolean){
    var obj:any
    if(esButton){
      obj={Tag:"Button",Nombre:"Enviar>",valor:this.chatBox,Seccion:'Chat'}
    }else{
      obj={Tag:'Input',Accion:'keyup.enter',Tipo:'text',Nombre:'Chat',valor:this.chatBox,Seccion:'Chat'}
    }
    this._HelperService.enviarMsjAcciones(obj)
  }
  ErrorImgAsesor(){
    this.img='../../../../../assets/imagenes/174188.png'
  }
}
