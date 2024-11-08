import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,SimpleChanges, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { login, loginChat, loginSendDTO } from 'src/app/Core/Models/login';
import { AspNetUserService } from '../../../Services/AspNetUser/asp-net-user.service';
import { HelperService } from '../../../Services/helper.service';
import { SessionStorageService } from '../../../Services/session-storage.service';
import { AccountService } from '../../../Services/Account/account.service';
import { AlumnoService } from '../../../Services/Alumno/alumno.service';
import { Subject, Subscription, takeUntil, timer,filter } from 'rxjs';
import { SnackBarServiceService } from '../../../Services/SnackBarService/snack-bar-service.service';
import { ChatAtencionClienteService } from '../../../Services/ChatAtencionCliente/chat-atencion-cliente.service';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { ChatAtencionClienteContactoActualizarDTO, ChatAtencionClienteContactoDetalleRegistrarDTO, ChatAtencionClienteContactoRegistrarDTO } from 'src/app/Core/Models/ChatAtencionClienteDTO';
import { DatosPerfilService } from '../../../Services/DatosPerfil/datos-perfil.service';
import { ChatEnLineaService } from '../../../Services/ChatEnLinea/chat-en-linea.service';
import { ProgramasDetalleComponent } from 'src/app/Public/programas-detalle/programas-detalle.component';
import { SeccionProgramaService } from '../../../Services/SeccionPrograma/seccion-programa.service';
@Component({
  selector: 'app-chat-atencion-ventas',
  templateUrl: './chat-atencion-ventas.component.html',
  styleUrls: ['./chat-atencion-ventas.component.scss']
})
export class ChatAtencionVentasComponent implements OnInit, OnChanges {

  private signal$ = new Subject();
  @ViewChild('contenidoMsjAtc') contenidoMsj!: ElementRef;
  constructor(
    private _router: Router,
    private _AspNetUserService:AspNetUserService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _AccountService:AccountService,
    private _AlumnoService: AlumnoService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _ChatAtencionClienteService:ChatAtencionClienteService,
    private _ActivatedRoute: ActivatedRoute,
    private _DatosPerfilService:DatosPerfilService,
    private _ChatEnLinea: ChatEnLineaService,
    private _SeccionProgramaService: SeccionProgramaService,

  ) { }
  @Input() Open: boolean=false
  isBubbleOpen: boolean = false;
  stateAsesor:boolean =true;
  public stateAsesorAtc=false


  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() IdProgramageneral=0;
  @Input() IdPespecificoPrograma=0;
  public img='https://proceso-pago.bsginstitute.com/img-web/chatV2/'
  public Paso=0;
  public Caso='A';
  public RecuperarContrasenaBit=false;
  public BotonDesactivado=false;
  public RegistroChatAtc:ChatAtencionClienteContactoRegistrarDTO={
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
    EsSoporteTecnico: false
  }
  public RegistroChatDetalleAtc:ChatAtencionClienteContactoDetalleRegistrarDTO={
    IdChatAtencionClienteContacto: 0,
    PasoActual: 0,
    CasoActual: '',
    PasoSiguiente: 0,
    CasoSiguiente: '',
    MensajeEnviado: '',
  }
  public ActualizarChatAtc:ChatAtencionClienteContactoActualizarDTO={
    Id:0,
    IdPGeneral:0,
    IdPEspecifico:0,
    IdAlumno:0,
    FormularioEnviado:false,
    IdOportunidad:0,
    IdFaseOportunidadPortal:'',
    IdMatriculaCabecera:0
  }
  public IdChatAtencionClienteContacto=0
  //Para LOGIN
  formVal:boolean=false;
  statuscharge=false;
  initValues=false
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  public loginSend:loginSendDTO={password:'',username:''}
  public errorLogin=''
  login:loginChat={
    Email:"",
    Password:"",
  };
  fileds:Array<formulario>=[];
  public datos: DatosFormularioDTO ={
    nombres:'',
    apellidos:'',
    email:'',
    idPais:undefined,
    idRegion:undefined,
    movil:'',
    idCargo:undefined,
    idAreaFormacion:undefined,
    idAreaTrabajo:undefined,
    idIndustria:undefined,
  }
  //PARA RECUPERACION CONTRASEÑA
  email:any={
    email:""
  };
  public cleanSub=false;
  public CursosMatricula:any;
  public CursosPadreMatricula:any;
  public CursosHijoMatricula:any;
  public selectedPadreIdMatricula:any;
  public AreasCapacitacion:any;
  public CursosPorArea:any;
  public CargandoInformacion=false
  public IdContactoPortalSegmento:any;
  public RegistroHistoricoUsuario:any
  public IdMatriculaCabecera=0;
  public ChatSoporteTecnico=false
  public EsAcademico=false
  public EsSoporteTecnico=false
  public AcademicoDirecto=false
  public routerSubscription: Subscription | undefined = undefined;
  public RutaActualChat:any;
  public DatosCurso:any;
  public ChatAcademicoIniciadoLocal:any
  public IdAlumno=0;
  public TieneCoordinador=false
  public ContrasenaRecuperada=false;
  public IdAreaSeleccionada=0;
  ngOnDestroy() {
    // Cancelar suscripción para evitar pérdidas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.IdContactoPortalSegmento=this._SessionStorageService.SessionGetValue('usuarioWeb')
    console.log(this.IdContactoPortalSegmento)
    this.routerSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event)
        this.IdMatriculaCabecera=0
        if(this._SessionStorageService.GetToken()!=null){
          this.ChatAcademicoIniciadoLocal=this._SessionStorageService.SessionGetValue('ChatAcademicoIniciado')
          console.log(this.ChatAcademicoIniciadoLocal)
          if(this.ChatAcademicoIniciadoLocal!='true'){
            // Lógica para obtener ruta actual
            this.RutaActualChat=event.urlAfterRedirects;
            // Verificar si contiene "/AulaVirtual/"
            if (this.RutaActualChat.includes('/AulaVirtual/')) {
              // Verificar si después de "/AulaVirtual/" sigue "MisCursos/"
              if (this.RutaActualChat.includes('/AulaVirtual/MisCursos/')) {
                // Usar regex para verificar y extraer el número después de "/AulaVirtual/MisCursos/"
                const regex = /\/AulaVirtual\/MisCursos\/(\d+)/;
                const match = this.RutaActualChat.match(regex);
                if (match && this.ChatAcademicoIniciadoLocal!='true') {
                  this.IdMatriculaCabecera = Number(match[1]); // Extrae el número después de '/AulaVirtual/MisCursos/'
                  console.log('IdMatriculaCabecera', this.IdMatriculaCabecera);
                  this.Paso = 3;
                  this.Caso = 'B';
                } else {
                  console.log('llegóoooooooooo')
                  this.Paso = 2;
                  this.Caso = 'B';
                }
              } else {
                this.Paso = 2;
                this.Caso = 'B';
              }
            } else {
              this.Paso = 2;
              this.Caso = 'B';
            }
          }
        }
        console.log('INGRESA CABECERA 1')
        this.ObtenerInformacionChat();
      }
    });
    this._HelperService.recibirDatoCuenta.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        if(this._SessionStorageService.GetToken()!=null){
          this.Paso=2
          this.Caso='B'
        }
        this.ObtenerInformacionChat();
      }
    });
    console.log('INGRESA CABECERA 2')
    this.ObtenerInformacionChat();
    this.VerificarProgramasDetalle();
  }
  public VerificarProgramasDetalle(): void {
    let route = this._ActivatedRoute.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    console.log('COMPONENTE ACTUAL',route.snapshot.component)
    if (route.snapshot.component === ProgramasDetalleComponent) {
      this.toggleChat(true);
    }
    else{
      this.toggleChat(this.Open);
    }
  }

  toggleChat(state: boolean) {
    this.Open = state;
    this.IsOpen.emit(state);
  }
  ObtenerInformacionChat(){
    this.CargandoInformacion=true
    if(this._SessionStorageService.GetToken()!=null){
      console.log(this._router.url)
      const urlSegments = this._router.url.split('/');
      let assignNext = false; // Variable para determinar si el siguiente segmento debe ser asignado

      for (let segment of urlSegments) {
        console.log(segment);

        if (assignNext) {
          if (/^\d+$/.test(segment)) {
            this.IdMatriculaCabecera = Number(segment);
          }
          break; // Salimos del bucle después de asignar o no el valor
        }

        if (segment === 'MisCursos') {
          assignNext = true; // La próxima iteración asignará el valor si es un número
        }
      }

      console.log(this.IdMatriculaCabecera)
      if(this.IdMatriculaCabecera==0){
        this._ChatAtencionClienteService.ObtenerCursosAlumnoMatriculado().pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            console.log(x)
            if(x!=null){
              this.IdAlumno=x.cursosHijo[0].idAlumno
            }
          },
          complete:()=>{
            this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalle(this.IdContactoPortalSegmento,this.IdAlumno).pipe(takeUntil(this.signal$)).subscribe({
              next:x=>{
                console.log(x)
                this.RegistroHistoricoUsuario=x
              },
              complete:()=>{
                if(this.RegistroHistoricoUsuario!=null){
                  this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
                  this.Paso=this.RegistroHistoricoUsuario.pasoSiguiente;
                  this.Caso=this.RegistroHistoricoUsuario.casoSiguiente;
                  this.IdMatriculaCabecera=this.RegistroHistoricoUsuario.idMatriculaCabecera;
                  this.EsSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
                  this.ChatSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
                  let ValorFormulario="false";
                  if(this.RegistroHistoricoUsuario.formularioEnviado==true){
                    ValorFormulario="true"
                  }
                  this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado',ValorFormulario);
                  if(this._SessionStorageService.GetToken()!=null && this.Paso<=2 && this.Caso=='B'){
                    this.CursosMatriculados()
                    this.Paso=2
                    this.Caso='B'
                  }
                }
                else{
                  this.Paso=2
                  this.Caso='B'
                  console.log('INGRESA 1')
                  this.CursosMatriculados()
                }
              }
            })
          }
        })
      }
      else{
        this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalleAcademico(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            console.log(x)
            this.RegistroHistoricoUsuario=x;
          },
          complete:()=>{
            this.EsAcademico=true;
            if(this.RegistroHistoricoUsuario==null){
              this.AcademicoDirecto=true;
              this.Paso=3;
              this.Caso='B'
            }
            else{
              if(this.RegistroHistoricoUsuario.idMatriculaCabecera!=0){
                console.log('pasa por aca')
                this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
                this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
                this.Paso=this.RegistroHistoricoUsuario.pasoSiguiente;
                this.Caso=this.RegistroHistoricoUsuario.casoSiguiente;
                this.IdMatriculaCabecera=this.RegistroHistoricoUsuario.idMatriculaCabecera;
                this.EsSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
                this.ChatSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
                let ValorFormulario="false";
                console.log(this.RegistroHistoricoUsuario.formularioEnviado)
                if(this.RegistroHistoricoUsuario.formularioEnviado==true){
                  ValorFormulario="true"
                }
                this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado',ValorFormulario);
                if(this.Paso==2 && this.Caso=='B'){
                  console.log('INGRESA 2')
                  this.CursosMatriculados()
                }
              }
              else{
                this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
                this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
                this.Paso=this.RegistroHistoricoUsuario.pasoSiguiente;
                this.Caso=this.RegistroHistoricoUsuario.casoSiguiente;
                this.IdMatriculaCabecera=this.RegistroHistoricoUsuario.idMatriculaCabecera;
                this.ChatSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
                this.EsSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
              }
            }
          }
        })
      }
    }
    else{
      this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalle(this.IdContactoPortalSegmento,1).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.RegistroHistoricoUsuario=x
        },
        complete:()=>{
          if(this.RegistroHistoricoUsuario!=null){
            this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
            this.Paso=this.RegistroHistoricoUsuario.pasoSiguiente;
            this.Caso=this.RegistroHistoricoUsuario.casoSiguiente;
            this.IdPespecificoPrograma=this.RegistroHistoricoUsuario.IdPespecifico
            this.IdProgramageneral=this.RegistroHistoricoUsuario.idPGeneral
            if(this.Paso==1 && this.Caso=='A'){
              this.AreasCapacitacion=[];
              this.CargandoInformacion=true
              this._ChatAtencionClienteService.ObtenerAreasCapacitacionChatAtc().pipe(takeUntil(this.signal$)).subscribe({
                next:x=>{
                  this.AreasCapacitacion=x
                  console.log(this.AreasCapacitacion)
                },
                complete:()=>{
                  this.CargandoInformacion=false
                }

              })
            }
            if(this.Paso==2 && this.Caso=='A'){
              this._ChatAtencionClienteService.ObtenerAreasCapacitacionChatAtc().pipe(takeUntil(this.signal$)).subscribe({
                next:x=>{
                  console.log(x)
                  this.AreasCapacitacion=x
                },
                complete:()=>{
                  this.CargandoInformacion=false
                  let AreaSeleccionado =this.AreasCapacitacion.filter((areas:any) => areas.valor === this.RegistroHistoricoUsuario.mensajeEnviado);
                  console.log(AreaSeleccionado)
                  this.CursosPorArea=[];
                  this._ChatAtencionClienteService.ListaProgramasFiltroChatAtc(AreaSeleccionado[0].id).pipe(takeUntil(this.signal$)).subscribe({
                    next:x=>{
                      console.log(x)
                      this.CursosPorArea=x
                    },
                    complete:()=>{
                      this.CargandoInformacion=false
                      this.Paso=2
                      this.Caso='A'
                    }
                  })
                }
              })
            }
            if(this.Caso=='B'){
              this.Paso=0
              this.Caso='A'
              // console.log('INGRESA 3')
              // this.CursosMatriculados()
            }
            if(this._SessionStorageService.GetToken()==null && this.Paso==4){
              this.Paso=0
              this.Caso='A'
            }
          }
          else{
            this.Paso=0
            this.Caso='A'
          }
        }
      })

    }
    if(this.IdMatriculaCabecera!=0){
      this.ObtenerCoordinadorMatricula();
    }
    this.CargandoInformacion=false
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  // PARTE DE LOGUIN
  Login(value:any){
    if(this.formVal){
    this.CargandoInformacion=true
      this.loginSend.password=value.Password;
      this.loginSend.username=value.Email;
      this._AspNetUserService.Authenticate(this.loginSend).subscribe({
        next:x=>{
          this.statuscharge=false
          this._SessionStorageService.SetToken(x.token)
          this._AlumnoService.ObtenerCombosPerfil().subscribe({
            next: (x) => {
              this.datos.nombres = x.datosAlumno.nombres;
              this.datos.apellidos = x.datosAlumno.apellidos;
              this.datos.email = x.datosAlumno.email;
              this.datos.idPais = x.datosAlumno.idPais;
              this.datos.idRegion = x.datosAlumno.idDepartamento;
              this.datos.movil = x.datosAlumno.telefono;
              this.datos.idCargo = x.datosAlumno.idCargo;
              this.datos.idAreaFormacion = x.datosAlumno.idAreaFormacion;
              this.datos.idAreaTrabajo = x.datosAlumno.idAreaTrabajo;
              this.datos.idIndustria = x.datosAlumno.idIndustria

              this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
            }
          });
          this.DatoObservable.datoAvatar=true
          this.DatoObservable.datoContenido=true
          this._HelperService.enviarDatoCuenta(this.DatoObservable)
          console.log(this.DatoObservable);
          this._SessionStorageService.SessionSetValue('IdProveedor',x.idProveedor);
          this._SessionStorageService.SessionSetValue('Cursos',x.cursos);
          this._SessionStorageService.SessionSetValue('TipoCarrera',x.tipoCarrera);
        },
        error:e=>{
          this.statuscharge=false
          console.log(e)
          this.errorLogin=e.error.excepcion.descripcionGeneral;

          timer(20000).pipe(takeUntil(this.signal$)).subscribe(_=>{
            this.errorLogin='';
          })
        },
        complete:()=>{
          // this._router.navigate(['/AulaVirtual/MisCursos']);
          this.CargandoInformacion=true
          this.statuscharge=false
          this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
          this.RegistroChatDetalleAtc.PasoActual=1
          this.RegistroChatDetalleAtc.CasoActual='B'
          this.RegistroChatDetalleAtc.PasoSiguiente=2
          this.RegistroChatDetalleAtc.CasoSiguiente='B'
          this.RegistroChatDetalleAtc.MensajeEnviado='Sesión Iniciada: '+value.Email;
          this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
            },
            complete:()=>{
            }
          })
        }
      });
    }
  }
  // FIN DE LOGIN
  //RECUPERAR CONTRASEÑA
  RecuperarContrasenaPrevio(){
    this.fileds=[];
    this.Caso='C';
    this.fileds.push({
      nombre:"email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"Correo electrónico",
    });
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=1
    this.RegistroChatDetalleAtc.CasoActual='B'
    this.RegistroChatDetalleAtc.PasoSiguiente=1
    this.RegistroChatDetalleAtc.CasoSiguiente='C'
    this.RegistroChatDetalleAtc.MensajeEnviado="Recuperar Contraseña";
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
  RecuperarContrasena(evento:any){
    this.ContrasenaRecuperada=false;
    this.BotonDesactivado=true
    this.CargandoInformacion=true
    this._AccountService.RecuperarPasswordCuenta(evento.email).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.cleanSub=true
      },
      complete:()=>{
        this.ContrasenaRecuperada=true;
        this.OpcionAlumno(1,'B')
        this.BotonDesactivado=false;
        this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
        this.RegistroChatDetalleAtc.PasoActual=1
        this.RegistroChatDetalleAtc.CasoActual='C'
        this.RegistroChatDetalleAtc.PasoSiguiente=1
        this.RegistroChatDetalleAtc.CasoSiguiente='B'
        this.RegistroChatDetalleAtc.MensajeEnviado="Recuperar Contraseña Correo:" + evento.email;
        this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
          },
          complete:()=>{
            this.CargandoInformacion=false
          }
        })
        setTimeout(() => {
          this.ContrasenaRecuperada = false;
      }, 6000);
      }
    })
  }
  //FIN RECUPERAR CONTRASEÑA
  OpcionAlumno(Paso:number,Caso:string){
    if(this._SessionStorageService.GetToken()!=null && Paso==1 && Caso=='B'){
      console.log('HAY TOKENNNNNNN')
      this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
      this.RegistroChatDetalleAtc.PasoActual=0
      this.RegistroChatDetalleAtc.CasoActual='A'
      this.RegistroChatDetalleAtc.PasoSiguiente=2
      this.RegistroChatDetalleAtc.CasoSiguiente='B'
      this.RegistroChatDetalleAtc.MensajeEnviado="Soy Alumno Logueado";
      this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.CursosMatriculados();
        },
        complete:()=>{
          this.Paso=2;
          this.Caso='B'
        }
      })
    }
    else{
      console.log(this.IdContactoPortalSegmento)
      this.RegistroChatAtc.IdContactoPortalSegmento=this.IdContactoPortalSegmento;
      this.RegistroChatAtc.IdPGeneral=0;
      this.RegistroChatAtc.IdPEspecifico=0;
      this.RegistroChatAtc.IdAlumno=0;
      this.RegistroChatAtc.ChatIniciado=true;
      this.RegistroChatAtc.FormularioEnviado=false;
      this.RegistroChatAtc.ChatFinalizado=false;
      this.RegistroChatAtc.IdOportunidad=0;
      this._ChatAtencionClienteService.RegistrarChatAtencionClienteContacto(this.RegistroChatAtc).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.IdChatAtencionClienteContacto=x
        },
        complete:()=>{
          this.Paso=Paso;
          this.Caso=Caso;
          if(Paso==1 && Caso=='A'){
            this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
            this.RegistroChatDetalleAtc.PasoActual=0
            this.RegistroChatDetalleAtc.CasoActual='A'
            this.RegistroChatDetalleAtc.PasoSiguiente=1
            this.RegistroChatDetalleAtc.CasoSiguiente='A'
            this.RegistroChatDetalleAtc.MensajeEnviado="Estoy interesado en los cursos";
            this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
              next:x=>{
              }
            })
            this.AreasCapacitacion=[];
            this.CargandoInformacion=true
            this._ChatAtencionClienteService.ObtenerAreasCapacitacionChatAtc().pipe(takeUntil(this.signal$)).subscribe({
              next:x=>{
                this.AreasCapacitacion=x
                console.log(this.AreasCapacitacion)
              },
              complete:()=>{
                this.CargandoInformacion=false
              }

            })
          }
          else{
            this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
            this.RegistroChatDetalleAtc.PasoActual=0
            this.RegistroChatDetalleAtc.CasoActual='B'
            this.RegistroChatDetalleAtc.PasoSiguiente=1
            this.RegistroChatDetalleAtc.CasoSiguiente='B'
            this.RegistroChatDetalleAtc.MensajeEnviado="Soy alumno";
            this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
              next:x=>{
              }
            })
            this.fileds=[];
            this.fileds.push({
              nombre:"Email",
              tipo:"text",
              valorInicial:"",
              validate:[Validators.required,Validators.email],
              label:"Correo electrónico",
              focus:true,
              error:"Ingresa tu correo electrónico"
            });
            this.fileds.push({
              nombre:"Password",
              tipo:"password",
              valorInicial:"",
              validate:[Validators.required],
              label:"Contraseña",
              error:"Ingresa tu contraseña"
            });
          }
        }
      })
    }
  }
  CursosMatriculados(){
    this.CargandoInformacion=true
    this.Paso=2;
    this.Caso='B'
    this._ChatAtencionClienteService.ObtenerCursosAlumnoMatriculado().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosMatricula=x
        console.log(x)
        this.CursosPadreMatricula=this.CursosMatricula.cursosPadre
        this.CursosHijoMatricula=this.CursosMatricula.cursosHijo
      },
      complete:()=>{
        this.CargandoInformacion=false
      }
    })
  }
  CursoPadreHijoMatriculado(courseId: number): void {
    console.log(courseId)
    this.selectedPadreIdMatricula = this.selectedPadreIdMatricula === courseId ? null : courseId;
  }
  getCursosHijo(courseId: number): any[] {
    return this.CursosHijoMatricula.filter((hijo:any) => hijo.idPGeneralPadre === courseId);
  }
  handleCursoClickFormulario(curso: any): void {
    if (curso.esPadre) {
      this.selectedPadreIdMatricula = (this.selectedPadreIdMatricula === curso.idPGeneralPadre) ? null : curso.idPGeneralPadre;
    } else {
      curso.nombrePGeneralHijo=curso.nombrePGeneralPadre;
      this.EnviarFormularioAtcAcademico(curso);
    }
  }

  EnviarFormularioAtcAcademico(CursoHijo:any){
    console.log(CursoHijo)
    if(this.IdChatAtencionClienteContacto==0){
      this.RegistroChatAtc.IdContactoPortalSegmento=this.IdContactoPortalSegmento;
      this.RegistroChatAtc.IdPGeneral=CursoHijo.idPGeneralPadre;
      this.RegistroChatAtc.IdPEspecifico=CursoHijo.idPEspecifico;
      this.RegistroChatAtc.IdAlumno=CursoHijo.idAlumno;
      this.RegistroChatAtc.ChatIniciado=true;
      this.RegistroChatAtc.FormularioEnviado=false;
      this.RegistroChatAtc.ChatFinalizado=false;
      this.RegistroChatAtc.IdOportunidad=0;
      this.RegistroChatAtc.IdMatriculaCabecera=CursoHijo.idMatriculaCabecera;
      this.RegistroChatAtc.EsAcademico=true;
      this.RegistroChatAtc.EsSoporteTecnico=false;
      this.IdProgramageneral=CursoHijo.idPGeneralPadre
      this.IdMatriculaCabecera=CursoHijo.idMatriculaCabecera
      this._ChatAtencionClienteService.RegistrarChatAtencionClienteContacto(this.RegistroChatAtc).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.IdChatAtencionClienteContacto=x
          console.log(x)
        },
        complete:()=>{
          this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
          this.RegistroChatDetalleAtc.PasoActual=2
          this.RegistroChatDetalleAtc.CasoActual='B'
          this.RegistroChatDetalleAtc.PasoSiguiente=3
          this.RegistroChatDetalleAtc.CasoSiguiente='B'
          this.RegistroChatDetalleAtc.MensajeEnviado=CursoHijo.nombrePGeneralHijo;
          this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
            },
            complete:()=>{
              this.Paso=3,
              this.Caso='B'
              this.ObtenerCoordinadorMatricula();
            }
          })
        }
      })
    }
    else{
      this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
      this.RegistroChatDetalleAtc.PasoActual=2
      this.RegistroChatDetalleAtc.CasoActual='B'
      this.RegistroChatDetalleAtc.PasoSiguiente=3
      this.RegistroChatDetalleAtc.CasoSiguiente='B'
      this.RegistroChatDetalleAtc.MensajeEnviado=CursoHijo.nombrePGeneralHijo;
      this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
        },
        complete:()=>{
          this.ActualizarChatAtc.Id=this.IdChatAtencionClienteContacto,
          this.ActualizarChatAtc.IdPGeneral=CursoHijo.idPGeneralPadre,
          this.ActualizarChatAtc.IdPEspecifico=CursoHijo.idPEspecifico,
          this.ActualizarChatAtc.IdAlumno=CursoHijo.idAlumno,
          this.ActualizarChatAtc.FormularioEnviado=true,
          this.ActualizarChatAtc.IdOportunidad=0,
          this.ActualizarChatAtc.IdFaseOportunidadPortal="00000000-0000-0000-0000-000000000000",
          this.ActualizarChatAtc.IdMatriculaCabecera=CursoHijo.idMatriculaCabecera,
          this.IdMatriculaCabecera=CursoHijo.idMatriculaCabecera,
          this.IdProgramageneral=CursoHijo.idPGeneralPadre
          this._ChatAtencionClienteService.ActualizarChatAtencionClienteContacto(this.ActualizarChatAtc).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
            },
            complete:()=> {
              this.Paso=3,
              this.Caso='B'
              this.ObtenerCoordinadorMatricula();
            },
          })
        }
      })
    }
  }
  ObtenerCursosIdArea(Area:any){
    /*let Area2 = {
      'id': 6,
      'valor': "Finanzas"
    };
    Area = Area2;*/
    this._SessionStorageService.SessionSetValue('Area', JSON.stringify(Area));
    
    this.IdAreaSeleccionada=Area;
    console.log(Area)
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=1
    this.RegistroChatDetalleAtc.CasoActual='A'
    this.RegistroChatDetalleAtc.PasoSiguiente=2
    this.RegistroChatDetalleAtc.CasoSiguiente='A'
    this.RegistroChatDetalleAtc.MensajeEnviado=Area.valor;
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
    this.CargandoInformacion=true
    this.CursosPorArea=[];
    this._ChatAtencionClienteService.ListaProgramasFiltroChatAtc(Area.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosPorArea=x
        console.log(this.CursosPorArea)
      },
      complete:()=>{
        this.CargandoInformacion=false
        this.Paso=2
        this.Caso='A'
      }
    })
  }
  RegistrarCursoSeleccionado(CursoSeleccionado:any){
    console.log(CursoSeleccionado)
    this.ActualizarChatAtc.Id=this.IdChatAtencionClienteContacto,
    this.ActualizarChatAtc.IdPGeneral=CursoSeleccionado.idPGeneral,
    this.ActualizarChatAtc.IdPEspecifico=0,
    this.ActualizarChatAtc.IdAlumno=0,
    this.ActualizarChatAtc.FormularioEnviado=false,
    this.ActualizarChatAtc.IdOportunidad=0,
    this.ActualizarChatAtc.IdFaseOportunidadPortal="00000000-0000-0000-0000-000000000000",
    this.ActualizarChatAtc.IdMatriculaCabecera=0,
    this.IdProgramageneral=CursoSeleccionado.idPGeneral
    this.IdPespecificoPrograma=0
    this._ChatAtencionClienteService.ActualizarChatAtencionClienteContacto(this.ActualizarChatAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      },
    })
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=2
    this.RegistroChatDetalleAtc.CasoActual='A'
    this.RegistroChatDetalleAtc.PasoSiguiente=3
    this.RegistroChatDetalleAtc.CasoSiguiente='A'
    this.RegistroChatDetalleAtc.MensajeEnviado=CursoSeleccionado.nombre;
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      },
      complete:()=>{
        this._SeccionProgramaService.ObtenerCabeceraProgramaGeneral(CursoSeleccionado.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
          next: x => {
            this.IdPespecificoPrograma=x.programaCabeceraDetalleDTO.listProgramaEspecificoInformacionDTO[0].id
          },
          complete:()=>{
            this.Paso=3;
            this.Caso='A'
          }
        })

      }
    })

  }
  RetrocederInicioA(){
    this.Paso=0
    this.Caso='A'
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=1
    this.RegistroChatDetalleAtc.CasoActual='A'
    this.RegistroChatDetalleAtc.PasoSiguiente=0
    this.RegistroChatDetalleAtc.CasoSiguiente='A'
    this.RegistroChatDetalleAtc.MensajeEnviado='Volver de Áreas de Capacitación a Inicio';
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
  RetrocederAreaA(){
    this.Paso=1
    this.Caso='A'
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=2
    this.RegistroChatDetalleAtc.CasoActual='A'
    this.RegistroChatDetalleAtc.PasoSiguiente=1
    this.RegistroChatDetalleAtc.CasoSiguiente='A'
    this.RegistroChatDetalleAtc.MensajeEnviado='Volver de Curso a Área de Capacitación';
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
    this.AreasCapacitacion=[];
    this.CargandoInformacion=true
    this._ChatAtencionClienteService.ObtenerAreasCapacitacionChatAtc().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.AreasCapacitacion=x
        console.log(this.AreasCapacitacion)
      },
      complete:()=>{
        this.CargandoInformacion=false
      }

    })
  }
  RetrocederInicioB(){
    this.Paso=0
    this.Caso='A'
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=1
    this.RegistroChatDetalleAtc.CasoActual='B'
    this.RegistroChatDetalleAtc.PasoSiguiente=0
    this.RegistroChatDetalleAtc.CasoSiguiente='A'
    this.RegistroChatDetalleAtc.MensajeEnviado='Volver de Login a Inicio';
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
  //CONECCIONES CON CHAT
  actualizarDatosAlumno(respuesta:any){

    // this.estadoLogueo="true"
    // this.hubConnection.invoke("actualizarDatosAlumno",respuesta.idAlumno,respuesta.id);
  }
  ActualizarEsSoporteTecnico(EsSoporteTecnico:boolean){
    this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
    this.RegistroChatDetalleAtc.PasoActual=3
    this.RegistroChatDetalleAtc.CasoActual='B'
    this.RegistroChatDetalleAtc.PasoSiguiente=4
    this.RegistroChatDetalleAtc.CasoSiguiente='B'
    if(EsSoporteTecnico==false){
      this.RegistroChatDetalleAtc.MensajeEnviado='Contactar con un Coordinador Académico';
    }
    else{
      this.RegistroChatDetalleAtc.MensajeEnviado='Tengo problemas tecnicos en el aula virtual';
    }
    this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      },
      complete:()=>{
        this._ChatAtencionClienteService.ActualizarEsSporteTecnicoChatAtencionClienteContacto(this.IdChatAtencionClienteContacto,EsSoporteTecnico).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
          },
          complete:()=> {
            this.Paso=4,
            this.Caso='B'
            this.ChatSoporteTecnico=EsSoporteTecnico;
            this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado','true');
          },
        })
      }
    })
  }
  ObtenerCoordinadorMatricula(){
    this._ChatEnLinea.ObtenerCoordinadorChat(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log('Información del coordinador',x)
        if(x!=null){
          this.TieneCoordinador=true;
        }
        else{
          this.TieneCoordinador=false;
        }
      },
      complete:()=>{

      }})
  }
  RegistroDirectoCursoMatriculado(EsSoporteTecnico:boolean){
    console.log(this.IdContactoPortalSegmento)
    if(this.IdChatAtencionClienteContacto==0)
      {
        this._DatosPerfilService.RegistroProgramaMatriculadoPorIdMatricula(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            console.log(x)
            this._HelperService.recibirMsjChat().pipe(takeUntil(this.signal$)).subscribe({
              next: (x) => {
                console.log(x)
              }
            })
            // this._HelperService.enviarMsjChat({
            //   idMatriculaCabecera:x.idMatriculaCabecera,
            //   idprogramageneralalumno:x.idPGeneral,
            //   idcoordinadora:x.idAsesor,
            //   idcentrocosto:x.idCentroCosto
            // });
            this.DatosCurso=x
          },
          complete:()=>{
            this.RegistroChatAtc.IdContactoPortalSegmento=this.IdContactoPortalSegmento;
            this.RegistroChatAtc.IdPGeneral=this.DatosCurso.idPGeneral;
            this.RegistroChatAtc.IdPEspecifico=this.DatosCurso.idPEspecifico;
            this.RegistroChatAtc.IdAlumno=this.DatosCurso.idAlumno;
            this.RegistroChatAtc.ChatIniciado=true;
            this.RegistroChatAtc.FormularioEnviado=true;
            this.RegistroChatAtc.ChatFinalizado=false;
            this.RegistroChatAtc.IdOportunidad=0;
            this.RegistroChatAtc.IdMatriculaCabecera=this.IdMatriculaCabecera;
            this.RegistroChatAtc.EsAcademico=true;
            this.RegistroChatAtc.EsSoporteTecnico=EsSoporteTecnico;
            console.log(this.IdMatriculaCabecera)
            console.log(this.RegistroChatAtc)
            this._ChatAtencionClienteService.RegistrarChatAtencionClienteContacto(this.RegistroChatAtc).pipe(takeUntil(this.signal$)).subscribe({
              next:x=>{
                this.IdChatAtencionClienteContacto=x
              },
              complete:()=>{
                this.Paso=4;
                this.Caso='B';
                this.ChatSoporteTecnico=EsSoporteTecnico
                if(EsSoporteTecnico){
                  this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
                  this.RegistroChatDetalleAtc.PasoActual=3
                  this.RegistroChatDetalleAtc.CasoActual='B'
                  this.RegistroChatDetalleAtc.PasoSiguiente=4
                  this.RegistroChatDetalleAtc.CasoSiguiente='B'
                  this.RegistroChatDetalleAtc.MensajeEnviado="Tengo problemas técnicos en el aula virtual";
                  this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
                    next:x=>{
                    }
                  })
                }
                else{
                  this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
                  this.RegistroChatDetalleAtc.PasoActual=3
                  this.RegistroChatDetalleAtc.CasoActual='B'
                  this.RegistroChatDetalleAtc.PasoSiguiente=4
                  this.RegistroChatDetalleAtc.CasoSiguiente='B'
                  this.RegistroChatDetalleAtc.MensajeEnviado="Contactar con un Coordinador Académico";
                  this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
                    next:x=>{
                    }
                  })
                }
                this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado','true');

              }
            })

          }
        })
      }
      else{
        this.Paso=4;
        this.Caso='B';
        this.ChatSoporteTecnico=EsSoporteTecnico
        if(EsSoporteTecnico){
          this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
          this.RegistroChatDetalleAtc.PasoActual=3
          this.RegistroChatDetalleAtc.CasoActual='B'
          this.RegistroChatDetalleAtc.PasoSiguiente=4
          this.RegistroChatDetalleAtc.CasoSiguiente='B'
          this.RegistroChatDetalleAtc.MensajeEnviado="Tengo problemas técnicos en el aula virtual";
          this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
            }
          })
        }
        else{
          this.RegistroChatDetalleAtc.IdChatAtencionClienteContacto=this.IdChatAtencionClienteContacto;
          this.RegistroChatDetalleAtc.PasoActual=3
          this.RegistroChatDetalleAtc.CasoActual='B'
          this.RegistroChatDetalleAtc.PasoSiguiente=4
          this.RegistroChatDetalleAtc.CasoSiguiente='B'
          this.RegistroChatDetalleAtc.MensajeEnviado="Contactar con un Coordinador Académico";
          this._ChatAtencionClienteService.RegistrarChatAtencionClienteContactoDetalle(this.RegistroChatDetalleAtc).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
            }
          })
        }
        this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado','true');
      }
  }
  CerrarInteraccionFormularioAcademico(){
    this._ChatAtencionClienteService.CerrarFormularioAcademicoIdMatriculaCabecera(this.IdChatAtencionClienteContacto).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
      },
      complete:()=>{
        this._router.navigate(['/contactenos'])
      }
    })
  }
  RetrocederInicioAcademico(){
    this._ChatAtencionClienteService.CerrarFormularioAcademicoIdMatriculaCabecera(this.IdChatAtencionClienteContacto).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
      },
      complete:()=>{
        this.CursosMatriculados();
        this.IdChatAtencionClienteContacto=0
      }
    })
  }
  RetrocederCursos(valor: boolean){
    console.log("Funcion RECTROCEDER CURSOS VENTAS");
    let respuesta = this._SessionStorageService.SessionGetValue('Area');
    let area = respuesta == "" ? null : JSON.parse(respuesta);
    console.log("REVISAR:", area);
    console.log("EL VALOR ES:", valor);
    if (valor) {
      this.Paso=2;
      this.Caso='A';

      this.ObtenerCursosIdArea(area);
    }
  }
  RetrocederInicio(){
    this.Paso=0
    this.Caso='A'
  }
  RetrocederInicioFormulario(valor: boolean,origen:number){
    console.log("Funcion RECTROCEDER INICIO FORMULARIO VENTAS");

    if (valor) {
      this._ChatAtencionClienteService.CerrarFormularioAcademicoIdMatriculaCabecera(this.IdChatAtencionClienteContacto).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
        },
        complete:()=>{
          this.IdChatAtencionClienteContacto=0
          this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado','false')
          console.log(origen)
          if(origen===2){
            console.log(1)
            this.CursosMatriculados();
            // window.location.reload()
          }
          else{
            console.log(2)
          this.RetrocederCursos(true)
          // window.location.reload()
          }

          }
      })
    }
  }
}

