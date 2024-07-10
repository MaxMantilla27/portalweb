import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,SimpleChanges, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { login, loginChat, loginSendDTO } from 'src/app/Core/Models/login';
import { AspNetUserService } from '../../Services/AspNetUser/asp-net-user.service';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { AccountService } from '../../Services/Account/account.service';
import { AlumnoService } from '../../Services/Alumno/alumno.service';
import { Subject, takeUntil, timer } from 'rxjs';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';
import { ChatAtencionClienteService } from '../../Services/ChatAtencionCliente/chat-atencion-cliente.service';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { ChatAtencionClienteContactoActualizarDTO, ChatAtencionClienteContactoDetalleRegistrarDTO, ChatAtencionClienteContactoRegistrarDTO } from 'src/app/Core/Models/ChatAtencionClienteDTO';
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
    private _ChatAtencionClienteService:ChatAtencionClienteService

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
    IdOportunidad: 0
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
  ngOnInit(): void {
    console.log()
    this.IdContactoPortalSegmento=this._SessionStorageService.SessionGetValue('usuarioWeb')
    console.log(this.IdContactoPortalSegmento)
    if(this._SessionStorageService.GetToken()!=null){
      this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalle(this.IdContactoPortalSegmento).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.RegistroHistoricoUsuario=x
          this.IdChatAtencionClienteContacto=x.idChatAtencionClienteContacto
          console.log(x)
        },
        complete:()=>{
          this.CursosMatriculados()
          if(this.RegistroHistoricoUsuario!=null && this.RegistroHistoricoUsuario.formularioEnviado){
            this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
            this.Paso=this.RegistroHistoricoUsuario.pasoSiguiente;
            this.Caso=this.RegistroHistoricoUsuario.casoSiguiente;
            this.IdMatriculaCabecera=this.RegistroHistoricoUsuario.idMatriculaCabecera;
            this.ChatSoporteTecnico=this.RegistroHistoricoUsuario.esSoporteTecnico;
          }
        }
      })
    }
    else{
      this._ChatAtencionClienteService.ObtenerChatAtencionClienteContactoDetalle(this.IdContactoPortalSegmento).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.RegistroHistoricoUsuario=x
          console.log(x)
        },
        complete:()=>{
          if(this.RegistroHistoricoUsuario!=null){
            this.IdChatAtencionClienteContacto=this.RegistroHistoricoUsuario.idChatAtencionClienteContacto
            this.Paso=this.RegistroHistoricoUsuario.pasoSiguiente;
            this.Caso=this.RegistroHistoricoUsuario.casoSiguiente;
            console.log(this.Paso)
            console.log(this.Caso)
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
                  this.AreasCapacitacion=x
                  console.log(this.AreasCapacitacion)
                },
                complete:()=>{
                  this.CargandoInformacion=false
                  let AreaSeleccionado =this.AreasCapacitacion.filter((areas:any) => areas.valor === this.RegistroHistoricoUsuario.mensajeEnviado);
                  console.log(AreaSeleccionado)
                  console.log(AreaSeleccionado[0].id)
                  this.CursosPorArea=[];
                  this._ChatAtencionClienteService.ListaProgramasFiltroChatAtc(AreaSeleccionado[0].id).pipe(takeUntil(this.signal$)).subscribe({
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
    if(this.Open && this.stateAsesor){
      timer(1).pipe(takeUntil(this.signal$)).subscribe(_=>{
        this.contenidoMsj.nativeElement.scrollTop=this.contenidoMsj.nativeElement.scrollHeight
      })
    }
  }
  // PARTE DE LOGUIN
  Login(value:any){
    if(this.formVal){
    this.CargandoInformacion=true
      console.log(value)
      this.loginSend.password=value.Password;
      this.loginSend.username=value.Email;
      this._AspNetUserService.Authenticate(this.loginSend).subscribe({
        next:x=>{
          this.statuscharge=false
          this._SessionStorageService.SetToken(x.token)
          console.log('TOKEN POR CHAT')
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
            }
          })
          this.CursosMatriculados()
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
          }
        })
        this.CargandoInformacion=false
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
  RecuperarAtras(){
    this.OpcionAlumno(1,'B')
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
        console.log(this.CursosPadreMatricula)
        console.log(this.CursosHijoMatricula)
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
        this.ActualizarChatAtc.IdPGeneral=CursoHijo.idPGeneralHijo,
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
}
