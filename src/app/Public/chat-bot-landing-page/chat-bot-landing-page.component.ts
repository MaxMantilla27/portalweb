import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatBotAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';
import { ActualizarAlumnoChatBotDTO, FlujoChatEntradalDTO, InicioEntradaChatbotDTO, ValidacionChatBotEnvioDTO } from 'src/app/Core/Models/ChatBotDTO';
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
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _HelperService:HelperService,
    private _SessionStorageService:SessionStorageService,
    private _ChatBotService:ChatBotService
  ) { }
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
    IdUsuario:''
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
  public dataInicial:InicioEntradaChatbotDTO={
    IdContactoPortalSegmento:this._SessionStorageService.SessionGetValue('usuarioWeb'),
    IdFormulario:567
  }
  public Paises:any;
  public min=0
  public max=1000

  ngOnInit(): void {
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
    this.InicializarChatbot()
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

        }
        this.flujoActual.IdChatbotUsuarioContacto=x.idChatbotUsuarioContacto
        this.flujoActual.NombreUsuario=x.nombreUsuarioRegistrado
        this.flujoActual.UsuarioRegistrado=x.registrado
        this.flujoActual.CodigoPGeneral=x.datosFormulario.codigoPGeneral
        this.flujoActual.NombrePGeneral=x.datosFormulario.nombrePGeneral
        if(x.historial!=null && x.historial.length>0){

        }
        this.FlujoConversacionPrincipal()
      }
    })
  }
  FlujoConversacionPrincipal(){
    this._ChatBotService.FlujoConversacionPrincipal(this.flujoActual).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.formControl.reset();
        this.pasoActual=x.itemFlujo
        if(this.pasoActual!=null && this.pasoActual!=undefined ){
          this.pasoActual.opciones=x.opciones

          this.SiguientesPasos.push(this.pasoActual)
          if(this.pasoActual.paso==1){
            this.primerpaso=this.pasoActual
          }else{
            this.chat=true
          }
          this.SetValidator();
        }
        console.log(this.SiguientesPasos)
        this.CargandoChat=false
      }
    })
  }
  ProcesarAsignacionAutomaticaChatbot(){
    this._ChatBotService.ProcesarAsignacionAutomaticaChatbot(this.OportunidadDTO).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.flujoActual.IdAlumno=x.idAlumno
        this.flujoActual.IdOportunidad=x.idOportunidad
        this.ActualizarAlumnoDTO.IdAlumno=x.idAlumno
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
    this._SessionStorageService.SessionSetValue('dataAlumnoChatBot',dataAlumno);
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
      this.ProcesarAsignacionAutomaticaChatbot();
    }else{
      if(this.pasoActual.nombreFuncion=='ActualizarAlumnoProbabilidad' && ValorDB!=null && ValorDB!=undefined && ValorDB!=0){
        this.ActualizarAlumnoDTO.IdentificadorApi=this.pasoActual.identificadorApi
        this.ActualizarAlumnoDTO.Valor=ValorDB.toString()
        this.ActualizarAlumnoChatBot()
      }else{
        this.FlujoConversacionPrincipal()
      }
    }
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
    this.FlujoConversacionPrincipal()
    console.log(this.datosAlumno)
  }
  SiguientePaso(){
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
}
