import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatBotAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import { ActualizarAlumnoChatBotDTO, FlujoChatEntradalDTO, InicioEntradaChatbotDTO, PerfilProfesionalDTO, ValidacionChatBotEnvioDTO } from 'src/app/Core/Models/ChatBotDTO';
import { ChatBotService } from 'src/app/Core/Shared/Services/ChatBot/chat-bot.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { MovilValidator } from 'src/app/Core/Shared/Validators/MovilValidator';

@Component({
  selector: 'app-chat-bot-landing-page',
  templateUrl: './chat-bot-landing-page.component.html',
  styleUrls: ['./chat-bot-landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatBotLandingPageComponent implements OnInit,OnDestroy{

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
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService,
    private _ChatBotService:ChatBotService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  chat=false
  CargandoChat=false
  public primerpaso :any
  public SiguientesPasos :Array<any>=[]
  public pasoActual :any
  public OportunidadDTO:ValidacionChatBotEnvioDTO={
    NombresCompletos:'',
    Celular:'',
    Correo:'',
    IdCategoriaDato:0,
    IdPespecifico:0,
    IdPrograma:0,
    IdCampania:0,
    IdUsuario:'',
    IdPais:0
  }
  public datosAlumno:ChatBotAlumnoDTO={
    Email:'',
    Movil:'',
    Nombres:'',
    IdAreaFormacion:0,
    IdAreaTrabajo:0,
    IdCargo:0,
    IdIndustria:0,
    IdPais:0,
    IdRegion:0,
    Id:0
  }
  public flujoActual:FlujoChatEntradalDTO={
    CodigoPGeneral:'',
    IdCampoContacto:0,
    IdChatbotUsuarioContacto:0,
    IdConfiguracionFlujoChatbot:1,
    NombrePGeneral:'',
    NombreUsuario:'',
    Paso:0,
    UsuarioRegistrado:false,
    Caso:'a',
    EsMensajeFinal:false,
    IdOportunidad:0,
    IdAlumno:0
  }
  public ActualizarAlumnoDTO:ActualizarAlumnoChatBotDTO={
    IdAlumno:0,
    IdentificadorApi:'',
    Valor:''
  }
  public datos:PerfilProfesionalDTO={
    CodigoPGeneral:'',
    IdCampo:0,
    IdCampoContacto:0,
    PrimerBloque:true
  }
  public dataInicial:InicioEntradaChatbotDTO={
    IdContactoPortalSegmento:this._SessionStorageService.SessionGetValue('usuarioWeb'),
    IdFormulario:567
  }
  public Paises:any;
  public min=0
  public max=1000
  public intervalInicio:any
  public opcionesTruFalse:Array<any>=[]
  ngOnInit(): void {
    if(this.isBrowser){
      this.intervalInicio= setInterval(()=>{
        var usuarioWeb=this._SessionStorageService.SessionGetValue('usuarioWeb');
        console.log(usuarioWeb)
        if(usuarioWeb!='' && usuarioWeb!=null && usuarioWeb.length>0){
          this.dataInicial.IdContactoPortalSegmento=usuarioWeb
          this.InicializarChatbot()
          clearInterval(this.intervalInicio);
        }
      },100);
    }
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.Paises=x;
        if(this.datosAlumno.Id==0 && this.Paises!=null && this.Paises!=undefined){
         this.SetPaisCodigo()
        }
      }
    })

    this._HelperService.recibirChangePais().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        if(this.datosAlumno.Id==0 && this.Paises!=null && this.Paises!=undefined){
         this.SetPaisCodigo()
        }
      }
    })
  }
  InicializarChatbot(){
    this.CargandoChat=true
    this._ChatBotService.InicializarChatbot(this.dataInicial).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        if(x.datosFormulario!=undefined && x.datosFormulario!=null){
          this.OportunidadDTO.IdCampania=x.datosFormulario.idConjuntoAnuncio
          this.OportunidadDTO.IdPrograma=x.datosFormulario.idPGeneral
          this.OportunidadDTO.IdPespecifico=x.datosFormulario.idPEspecifico
          this.OportunidadDTO.IdCategoriaDato=x.datosFormulario.idCategoriaOrigen
        }
        if(x.datosAlumno!=null){
          this.datosAlumno.Id=x.datosAlumno.idAlumno
          this.datosAlumno.Movil=x.datosAlumno.celular
          this.datosAlumno.Email=x.datosAlumno.correo
          this.datosAlumno.IdAreaFormacion=x.datosAlumno.idAreaFormacion
          this.datosAlumno.IdAreaTrabajo=x.datosAlumno.idAreaTrabajo
          this.datosAlumno.IdCargo=x.datosAlumno.idCargo
          this.datosAlumno.IdIndustria=x.datosAlumno.idIndustria
          this.datosAlumno.IdPais=x.datosAlumno.idPais
          this.datosAlumno.Nombres=x.datosAlumno.nombresCompletos
          this.ActualizarAlumnoDTO.IdAlumno=x.datosAlumno.idAlumno
        }else{
          var dataAlumnoLocal=this._SessionStorageService.SessionGetValue('dataAlumnoChatBot'+this.OportunidadDTO.IdPrograma);
          if(dataAlumnoLocal!='' && dataAlumnoLocal!=null){
            this.datosAlumno=JSON.parse(dataAlumnoLocal)
          }
        }
        console.log(this.datosAlumno)
        this.flujoActual.IdChatbotUsuarioContacto=x.idChatbotUsuarioContacto
        this.flujoActual.NombreUsuario=x.nombreUsuarioRegistrado
        this.flujoActual.UsuarioRegistrado=x.registrado
        this.flujoActual.CodigoPGeneral=x.datosFormulario.codigoPGeneral
        this.flujoActual.NombrePGeneral=x.datosFormulario.nombrePGeneral
        this.flujoActual.IdAlumno=x.idAlumno
        this.flujoActual.IdOportunidad=x.idOportunidad
        if(x.historial!=null && x.historial.length>0){
          x.historial.forEach((h:any) => {
            var opcionesdesc=null;
            if(h.opcionEnviadoJson!=undefined && h.opcionEnviadoJson!=null){
              opcionesdesc=JSON.parse(h.opcionEnviadoJson)
            }
            console.log("opciones",opcionesdesc)
            this.SiguientesPasos.push(
              {
                idChatbotConfiguracionFlujo: 1,
                usuarioRegistrado: h.usuarioRegistrado,
                paso: h.paso,
                caso:h.caso,
                esMensajeFinal: false,
                mensaje: h.mensajeEnviado,
                nombreFuncion: h.nombreFuncion,
                mensajeErrorValidacion: h.mensajeErrorValidacion,
                idCampoContacto: h.idCampoContacto,
                identificadorApi: h.identificadorApi,
                opciones: opcionesdesc,
                respuesta:h.tipoOpcion=='TrueFalse'?null:h.respuesta,
                tipoOpcion:h.tipoOpcion
            }
            )
          });
          console.log("siguientespasos",this.SiguientesPasos)
          var pasoActualHistotial=x.historial[x.historial.length-1]
          this.CargandoChat=true
          this.flujoActual.Paso=pasoActualHistotial.paso
          this.flujoActual.Caso=pasoActualHistotial.caso
          this.flujoActual.MensajeEnviado=pasoActualHistotial.mensajeEnviado
          this.flujoActual.IdCampoContacto=pasoActualHistotial.idCampoContacto
          if(this.datosAlumno.Nombres!=null){
            this.flujoActual.NombreUsuario=this.datosAlumno.Nombres
          }
          this.flujoActual.Respuesta=pasoActualHistotial.respuesta.toString()
          if(pasoActualHistotial.opcionEnviadoJson!=undefined && pasoActualHistotial.opcionEnviadoJson!=null){
            this.flujoActual.OpcionEnviadoJson=JSON.stringify(pasoActualHistotial.opcionEnviadoJson)
          }
          this.SiguientesPasos.forEach((p) => {
            p.respondido=true
          });
          this.primerpaso=this.SiguientesPasos[0]
          this.pasoActual=this.SiguientesPasos[this.SiguientesPasos.length-1]
        }
        this.FlujoConversacionPrincipal()
      }
    })
  }
  FlujoConversacionPrincipal(){
    this._ChatBotService.FlujoConversacionPrincipal(this.flujoActual).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);

        //if(x.itemFlujo==null)
          //{
          //this.flujoActual.EsMensajeFinal=true
          //this.FlujoConversacionPrincipal();
          //}else
        //{
          if(x.itemFlujo!=null){
            this.formControl.reset();
            this.pasoActual=x.itemFlujo
            this.pasoActual.respuesta=''
            if(this.pasoActual!=null && this.pasoActual!=undefined ){
              this.pasoActual.opciones=x.opciones
              if(this.pasoActual.tipoOpcion=="TrueFalse" && this.pasoActual.opciones!=null && this.pasoActual.opciones!=undefined && this.pasoActual.opciones.length>0){
                var existen=0
                this.pasoActual.opciones.forEach((o:any) => {
                  if(o.idCampo==null || o.idCampo==0){
                    existen++
                  }
                  o.Check=true
                });
                this.opcionesTruFalse=this.pasoActual.opciones
                if(existen==this.pasoActual.opciones.length){
                  this.ContinuarOpciones()
                }
              }
              this.SiguientesPasos.push(this.pasoActual)
              if(this.pasoActual.paso==1){
                this.primerpaso=this.pasoActual
              }else{
                this.chat=true
              }
              this.SetValidator();
              if(this.datosAlumno.Id!=null && this.datosAlumno.Id!=0 ){
                this.SetDataForm()
              }
            }
            console.log(this.SiguientesPasos)
            this.CargandoChat=false
            if(this.pasoActual.esMensajeFinal==true){
              this.flujoActual.EsMensajeFinal=true
              this.FlujoConversacionPrincipal();
            }
          }
      // }

      }
    })
  }
  ProcesarAsignacionAutomaticaChatbot(){
    this._ChatBotService.ProcesarAsignacionAutomaticaChatbot(this.OportunidadDTO).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.flujoActual.IdAlumno=x.idAlumno
        this.flujoActual.IdOportunidad=x.idOportunidad
        this.ActualizarAlumnoDTO.IdAlumno=x.idAlumno
        //this.flujoActual.IdAlumno=10550890
        //this.flujoActual.IdOportunidad=2450547

        this.ActualizarIdOportunidadChatbotUsuarioContacto();
        this.FlujoConversacionPrincipal()
      }
    })
  }

  SetPaisCodigo(){
    var codigoISo=this._SessionStorageService.SessionGetValue('ISO_PAIS');
    this.Paises.forEach((p:any) => {
      if(p.codigoIso==codigoISo){
        this.datosAlumno.IdPais=p.idPais
        this.min=p.longCelularAlterno
        this.max=p.longCelular
      }
    });
  }
  SetPaisId(){
    this.Paises.forEach((p:any) => {
      if(p.codigoIso==this.datosAlumno.IdPais){
        this.min=p.longCelularAlterno
        this.max=p.longCelular
      }
    });
  }
  SetValidator(){
    console.log(this.pasoActual)
    this.formControl.clearValidators();
    if(this.pasoActual.identificadorApi=='Email') {
      this.formControl.setValidators([Validators.required,Validators.email])
    };
    if(this.pasoActual.identificadorApi=='Movil'){
      var idPais=this.datosAlumno.IdPais==undefined?0:this.datosAlumno.IdPais
      this.formControl.setValidators([Validators.required,Validators.minLength(this.min),Validators.maxLength(this.max),MovilValidator(idPais)])
    };
    if(this.pasoActual.identificadorApi=='Nombres'){
      this.formControl.setValidators([Validators.required])
    };
    console.log(this.formControl)
  }
  SetDatAlumno(){
    if(this.pasoActual.identificadorApi=='Email') this.datosAlumno.Email=this.formControl.value;
    if(this.pasoActual.identificadorApi=='Movil') this.datosAlumno.Movil=this.formControl.value;
    if(this.pasoActual.identificadorApi=='Nombres') this.datosAlumno.Nombres=this.formControl.value;
    var dataAlumno=JSON.stringify(this.datosAlumno)
    this._SessionStorageService.SessionSetValue('dataAlumnoChatBot'+this.OportunidadDTO.IdPrograma,dataAlumno);
  }
  SetDataForm(){
    if(this.pasoActual.identificadorApi=='Email') this.formControl.setValue(this.datosAlumno.Email);
    if(this.pasoActual.identificadorApi=='Movil') this.formControl.setValue(this.datosAlumno.Movil);
    if(this.pasoActual.identificadorApi=='Nombres') this.formControl.setValue(this.datosAlumno.Nombres);
  }
  CleanDataAlumno(){

  }
  obtenerErrorCampoNombre() {
    var campo = this.formControl;
    if (campo!.hasError('required')) {
      if(this.pasoActual.identificadorApi=='Email') return 'El correo electronico es necesario';
      if(this.pasoActual.identificadorApi=='Movil') return 'El numero telefonico es necesario';
      if(this.pasoActual.identificadorApi=='Nombres') return 'Ingresa tus nombres';

      return ''
    }

    if (campo!.hasError('minlength')) {
      if(this.pasoActual.identificadorApi=='Movil'){
        return 'La longitud debe ser de '+(this.min) +' dígitos minimo'
      }
      return 'La longitud es incorrecta';
    }
    if (campo!.hasError('maxlength')) {
      if(this.pasoActual.identificadorApi=='Movil'){
        return 'La longitud debe ser de '+(this.max) +' dígitos maximo'
      }
      return 'La longitud es incorrecta';
    }
    if (campo!.hasError('Email')) {
      return 'El campo tiene que ser un correo (example@example.com)';
    }
    if (campo!.hasError('MovilValidator')) {
      var nombre=this.datosAlumno.Nombres.split(' ')
      if(nombre!=undefined && nombre.length>0){
        return this.pasoActual.mensajeErrorValidacion;
      }
    }
    return this.pasoActual.mensajeErrorValidacion;
  }
  ContinuarFlujo(ValorDB:any){
    if(this.pasoActual.nombreFuncion=='CreacionAlumnoOportunidad'){
      this.OportunidadDTO.NombresCompletos=this.datosAlumno.Nombres
      this.OportunidadDTO.Celular=this.datosAlumno.Movil
      this.OportunidadDTO.Correo=this.datosAlumno.Email
      this.OportunidadDTO.IdPais=this.datosAlumno.IdPais
      this.ProcesarAsignacionAutomaticaChatbot();
    }else{
      if((this.pasoActual.nombreFuncion=='ActualizarAlumnoProbabilidad' || this.pasoActual.nombreFuncion=='ActualizarAlumno') && ValorDB!=null && ValorDB!=undefined && ValorDB!=0){
        this.ActualizarAlumnoDTO.IdentificadorApi=this.pasoActual.identificadorApi
        this.ActualizarAlumnoDTO.Valor=ValorDB.toString()
        this.ActualizarAlumnoChatBot()
      }else{
        this.FlujoConversacionPrincipal()
      }
    }
  }
  ActualizarIdOportunidadChatbotUsuarioContacto(){
    this._ChatBotService.ActualizarIdOportunidadChatbotUsuarioContacto(this.flujoActual.IdChatbotUsuarioContacto,this.flujoActual.IdOportunidad,this.flujoActual.IdAlumno).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
  ActualizarAlumnoChatBot(){
    this._ChatBotService.ActualizarAlumnoChatBot(this.ActualizarAlumnoDTO).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.FlujoConversacionPrincipal()
      }
    })
  }
  IrChat(){
    this.CargandoChat=true
    this.SetDatAlumno();
    this.flujoActual.Paso=this.pasoActual.paso
    this.flujoActual.Caso=this.pasoActual.caso
    this.flujoActual.MensajeEnviado=this.pasoActual.mensaje
    this.flujoActual.IdCampoContacto=this.pasoActual.idCampoContacto
    this.flujoActual.NombreUsuario=this.datosAlumno.Nombres
    this.flujoActual.Respuesta=this.formControl.value
    if(this.pasoActual.opciones!=undefined && this.pasoActual.opciones!=null){
      this.flujoActual.OpcionEnviadoJson=JSON.stringify(this.pasoActual.opciones)
    }
    this.SiguientesPasos.forEach((p) => {
      p.respondido=true
    });
    this.SiguientesPasos[this.SiguientesPasos.length-1].respuesta=this.formControl.value
    this.ValidacionAlumnoCorreoChatBot()
    console.log(this.datosAlumno)
  }
  ValidacionAlumnoCorreoChatBot(){
    this._ChatBotService.ValidacionAlumnoCorreoChatBot(this.datosAlumno.Email).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x!=null && x!=undefined){
          this.datosAlumno.Id=x.idAlumno
          this.datosAlumno.Movil=x.celular
          this.datosAlumno.Email=x.correo
          this.datosAlumno.IdAreaFormacion=x.idAreaFormacion
          this.datosAlumno.IdAreaTrabajo=x.idAreaTrabajo
          this.datosAlumno.IdCargo=x.idCargo
          this.datosAlumno.IdIndustria=x.idIndustria
          this.datosAlumno.IdPais=x.idPais
          this.datosAlumno.Nombres=x.nombresCompletos
          this.ActualizarAlumnoDTO.IdAlumno=x.idAlumno
          this.flujoActual.UsuarioRegistrado=true
        }
        this.FlujoConversacionPrincipal()
      }
    })
  }
  SiguientePaso(){
    this.CargandoChat=true
    this.SetDatAlumno();
    this.flujoActual.Paso=this.pasoActual.paso
    this.flujoActual.Caso=this.pasoActual.caso
    this.flujoActual.MensajeEnviado=this.pasoActual.mensaje
    this.flujoActual.IdCampoContacto=this.pasoActual.idCampoContacto
    this.flujoActual.NombreUsuario=this.datosAlumno.Nombres
    this.flujoActual.Respuesta=this.formControl.value.toString()
    if(this.pasoActual.opciones!=undefined && this.pasoActual.opciones!=null){
      this.flujoActual.OpcionEnviadoJson=JSON.stringify(this.pasoActual.opciones)
    }
    this.SiguientesPasos.forEach((p) => {
      p.respondido=true
    });
    this.SiguientesPasos[this.SiguientesPasos.length-1].respuesta=this.formControl.value
    this.ContinuarFlujo(this.formControl.value)
    console.log(this.datosAlumno)
  }
  SelectOpciones(item:any){
    this.CargandoChat=true
    if(this.pasoActual.identificadorApi=='IdAreaFormacion')this.datosAlumno.IdAreaFormacion=item.id;
    if(this.pasoActual.identificadorApi=='IdAreaTrabajo')this.datosAlumno.IdAreaTrabajo=item.id;
    if(this.pasoActual.identificadorApi=='IdIndustria')this.datosAlumno.IdIndustria=item.id;
    if(this.pasoActual.identificadorApi=='IdCargo')this.datosAlumno.IdCargo=item.id;

    this.flujoActual.Paso=this.pasoActual.paso
    this.flujoActual.Caso=this.pasoActual.caso
    this.flujoActual.MensajeEnviado=this.pasoActual.mensaje
    this.flujoActual.IdCampoContacto=this.pasoActual.idCampoContacto
    this.flujoActual.NombreUsuario=this.datosAlumno.Nombres
    this.flujoActual.Respuesta=item.nombre
    if(this.pasoActual.opciones!=undefined && this.pasoActual.opciones!=null){
      this.flujoActual.OpcionEnviadoJson=JSON.stringify(this.pasoActual.opciones)
    }
    this.SiguientesPasos.forEach((p) => {
      p.respondido=true
    });
    this.SiguientesPasos[this.SiguientesPasos.length-1].respuesta=item.nombre
    this.ContinuarFlujo(item.id)
    console.log(this.datosAlumno)
  }
  ContinuarOpciones(){
    this.CargandoChat=true
    console.log(this.opcionesTruFalse)
    this.SiguientesPasos.forEach((p) => {
      p.respondido=true
    });
    this.SiguientesPasos[this.SiguientesPasos.length-1].respuesta=null
    var hayerrore=false
    for (let index = 0; index < this.opcionesTruFalse.length; index++) {
      if(this.opcionesTruFalse[index].Check!=true){
        var msg='Muy Bien '+this.datosAlumno.Nombres+', vemos que cambiaste tu '+ this.opcionesTruFalse[index].nombre +' por favor actualizalo seleccionando una de las siguientes opciones:'
        this.ObtenerCincoOpcionesPerfilProfesionalChatbot(this.opcionesTruFalse[index],msg)
        hayerrore=true
        break;
      }
      if(this.opcionesTruFalse[index].idCampo==0 || this.opcionesTruFalse[index].idCampo==null){
        var msg='Muy Bien '+this.datosAlumno.Nombres+', necesitamos conocer tu '+ this.opcionesTruFalse[index].nombre +' por favor selecciona una de las siguientes opciones:'
        this.ObtenerCincoOpcionesPerfilProfesionalChatbot(this.opcionesTruFalse[index],msg)
        hayerrore=true
        break;
      }
    }
    if(hayerrore==false){
      this.flujoActual.Paso=this.pasoActual.paso
      this.flujoActual.Caso=this.pasoActual.caso
      this.flujoActual.MensajeEnviado=this.pasoActual.mensaje
      this.flujoActual.IdCampoContacto=this.pasoActual.idCampoContacto
      this.flujoActual.NombreUsuario=this.datosAlumno.Nombres
      this.flujoActual.Respuesta=''
      if(this.pasoActual.opciones!=undefined && this.pasoActual.opciones!=null){
        this.flujoActual.OpcionEnviadoJson=JSON.stringify(this.pasoActual.opciones)
      }
      this.ContinuarFlujo('')
    }
  }
  ObtenerCincoOpcionesPerfilProfesionalChatbot(data:any,mensaje:string){
    this.datos.CodigoPGeneral=this.flujoActual.CodigoPGeneral
    this.datos.IdCampo=data.idCampo
    this.datos.IdCampoContacto=data.id

    this._ChatBotService.ObtenerCincoOpcionesPerfilProfesionalChatbot(this.datos).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.SiguientesPasos.push(
          {
            idChatbotConfiguracionFlujo: 1,
            usuarioRegistrado: this.pasoActual.usuarioRegistrado,
            paso: this.pasoActual.paso,
            caso:this.pasoActual.caso,
            esMensajeFinal: false,
            mensaje: mensaje,
            nombreFuncion: this.pasoActual.nombreFuncion,
            mensajeErrorValidacion: this.pasoActual.mensajeErrorValidacion,
            idCampoContacto: this.pasoActual.idCampoContacto,
            identificadorApi: this.pasoActual.identificadorApi,
            opciones: null,
            respuesta:null,
            tipoOpcion:'TrueFalse',
            opciones2: x,
        })
        this.CargandoChat=false
        console.log(this.SiguientesPasos)
      }
    })
  }

  ActualizarAlumnoChatBot2(valor:number){

    this.ActualizarAlumnoDTO.IdAlumno=this.datosAlumno.Id
    var indicemal=0
    for (let index = 0; index < this.opcionesTruFalse.length; index++) {
      if(this.opcionesTruFalse[index].Check!=true || this.opcionesTruFalse[index].idCampo==0 || this.opcionesTruFalse[index].idCampo==null){
        indicemal=index
        break;
      }
    }
    console.log(this.opcionesTruFalse)
    console.log(indicemal)
    switch (this.opcionesTruFalse[indicemal].id) {
      case 7:
        this.ActualizarAlumnoDTO.IdentificadorApi='IdCargo'
        break;
      case 8:
        this.ActualizarAlumnoDTO.IdentificadorApi='IdAreaFormacion'
        break;
      case 9:
        this.ActualizarAlumnoDTO.IdentificadorApi='IdAreaTrabajo'
        break;
      case 10:
        this.ActualizarAlumnoDTO.IdentificadorApi='IdIndustria'
        break;
      default:
        this.ActualizarAlumnoDTO.IdentificadorApi='IdCargo'
        break;
    }
    this.ActualizarAlumnoDTO.Valor=valor.toString()
    this._ChatBotService.ActualizarAlumnoChatBot(this.ActualizarAlumnoDTO).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.opcionesTruFalse[indicemal].idCampo=valor.toString()
        this.opcionesTruFalse[indicemal].Check=true
        this.opcionesTruFalse[indicemal].campo=x
        this.ContinuarOpciones()
      }
    })
  }

}
