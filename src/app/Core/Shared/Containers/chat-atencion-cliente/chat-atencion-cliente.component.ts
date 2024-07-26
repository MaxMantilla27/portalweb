import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,SimpleChanges, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { login, loginChat, loginSendDTO } from 'src/app/Core/Models/login';
import { AspNetUserService } from '../../Services/AspNetUser/asp-net-user.service';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { AccountService } from '../../Services/Account/account.service';
import { AlumnoService } from '../../Services/Alumno/alumno.service';
import { Subject, Subscription, takeUntil, timer,filter } from 'rxjs';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';
import { ChatAtencionClienteService } from '../../Services/ChatAtencionCliente/chat-atencion-cliente.service';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { ChatAtencionClienteContactoActualizarDTO, ChatAtencionClienteContactoDetalleRegistrarDTO, ChatAtencionClienteContactoRegistrarDTO } from 'src/app/Core/Models/ChatAtencionClienteDTO';
import { DatosPerfilService } from '../../Services/DatosPerfil/datos-perfil.service';
@Component({
  selector: 'app-chat-atencion-cliente',
  templateUrl: './chat-atencion-cliente.component.html',
  styleUrls: ['./chat-atencion-cliente.component.scss']
})
export class ChatAtencionClienteComponent implements OnInit,OnChanges {
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
  ) { }
  public Open: boolean=false
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
  public CursosPorArea:any
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
  ngOnDestroy() {
    // Cancelar suscripción para evitar pérdidas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.routerSubscription = this._router.events.subscribe(event => {
      if(this._SessionStorageService.GetToken()!=null){
        if (event instanceof NavigationEnd) {
          this.ChatAcademicoIniciadoLocal=this._SessionStorageService.SessionGetValue('ChatAcademicoIniciado')
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
      }
      else{

      }
    });
    this.IdContactoPortalSegmento=this._SessionStorageService.SessionGetValue('usuarioWeb')
    this._HelperService.recibirDatoCuenta.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.ObtenerInformacionChat();
      }
    });
    this.ObtenerInformacionChat();
  }
  ObtenerInformacionChat(){
    if(this._SessionStorageService.GetToken()!=null){
      const urlSegments = this._router.url.split('/');
      for (let segment of urlSegments) {
        if (/^\d+$/.test(segment)) {
          this.IdMatriculaCabecera = Number(segment);
          break;
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
                  if(this.Paso==2 && this.Caso=='B'){
                    this.CursosMatriculados()
                  }
                }
                else{
                  this.Paso=2
                  this.Caso='B'
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
                this._SessionStorageService.SessionSetValue('ChatAcademicoIniciado',ValorFormulario);
                if(this.Paso==2 && this.Caso=='B'){
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
                this.CursosMatriculados()
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
            console.log(this.Paso)
            console.log(this.Caso)
            console.log(this.RegistroHistoricoUsuario)
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
            if(this.Paso==2 && this.Caso=='B'){
              this.CursosMatriculados()
            }
          }
          else{
            this.Paso=0
            this.Caso='A'
          }
        }
      })

    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    var aux = this._SessionStorageService.GetToken()
    console.log('CHANGESSSS',aux)
    let  routeSub: Subscription;
    routeSub= this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((x:any) => {
      console.log(x)
      this.IdContactoPortalSegmento = this._SessionStorageService.SessionGetValue('usuarioWeb');
      if (this.Open) {
        timer(1).pipe(takeUntil(this.signal$)).subscribe(_ => {
          this.contenidoMsj.nativeElement.scrollTop = this.contenidoMsj.nativeElement.scrollHeight;
        });
      }
    });
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
          this._router.navigate(['/AulaVirtual/MisCursos']);
          this.CargandoInformacion=false
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
              this.CursosMatriculados()
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
    this.BotonDesactivado=true
    this.CargandoInformacion=true
    this._AccountService.RecuperarPasswordCuenta(evento.email).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.cleanSub=true
        if(x.excepcionGenerada==false){
          this._SnackBarServiceService.openSnackBar(x.descripcionGeneral,'x',15,"snackbarCrucigramaSucces");
        }else{

          this._SnackBarServiceService.openSnackBar(x.descripcionGeneral,'x',10,"snackbarCrucigramaerror");
        }
      },
      complete:()=>{
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
      }
    })
  }
  //FIN RECUPERAR CONTRASEÑA
  OpcionAlumno(Paso:number,Caso:string){
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
  CursosMatriculados(){
    this.CargandoInformacion=true
    this.Paso=2;
    this.Caso='B'
    this._ChatAtencionClienteService.ObtenerCursosAlumnoMatriculado().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosMatricula=x
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
          this._ChatAtencionClienteService.ActualizarChatAtencionClienteContacto(this.ActualizarChatAtc).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
            },
            complete:()=> {
              this.Paso=3,
              this.Caso='B'
            },
          })
        }
      })
    }





  }
  ObtenerCursosIdArea(Area:any){
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
    this.Paso=3;
    this.Caso='A'
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
        this._router.navigate(['/'+CursoSeleccionado.direccion])
        this._SessionStorageService.SessionSetValue('ChatAtencionCliente',JSON.stringify(CursoSeleccionado.direccion));
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
          },
        })
      }
    })
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
}
