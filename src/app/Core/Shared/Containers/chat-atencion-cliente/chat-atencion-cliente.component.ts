import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
@Component({
  selector: 'app-chat-atencion-cliente',
  templateUrl: './chat-atencion-cliente.component.html',
  styleUrls: ['./chat-atencion-cliente.component.scss']
})
export class ChatAtencionClienteComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private router: Router,
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
  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  public img='https://proceso-pago.bsginstitute.com/img-web/chatV2/'
  public Paso=0;
  public Caso='A';
  public RecuperarContrasenaBit=false;
  public BotonDesactivado=false;
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
  ngOnInit(): void {
    console.log()
    if(this._SessionStorageService.GetToken()!=null){
      this.CursosMatriculados()
    }
    else{
      this.Paso=0
      this.Caso='A'
    }
  }
  // PARTE DE LOGUIN
  Login(value:any){
    if(this.formVal){
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
          this.statuscharge=false
          this.CursosMatriculados()
        }
      });
    }

  }
  // FIN DE LOGIN
  //RECUPERAR CONTRASEÑA
  RecuperarContrasenaPrevio(){
    this.fileds=[];
    this.RecuperarContrasenaBit=true;
    this.fileds.push({
      nombre:"email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"Correo electrónico",
    });
  }
  RecuperarContrasena(evento:any){
    this.BotonDesactivado=true
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
        this.RecuperarContrasenaBit=false;
        this.BotonDesactivado=false;
      }
    })
  }
  //FIN RECUPERAR CONTRASEÑA
  OpcionAlumno(Paso:number,Caso:string){
    this.Paso=Paso;
    this.Caso=Caso;
    if(Paso==1 && Caso=='A'){
      this.AreasCapacitacion=[];
      this._ChatAtencionClienteService.ObtenerAreasCapacitacionChatAtc().pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.AreasCapacitacion=x
          console.log(this.AreasCapacitacion)
        }
      })

    }
    else{
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
  RecuperarAtras(){
    this.OpcionAlumno(1,'B')
    this.RecuperarContrasenaBit=false;
  }
  CursosMatriculados(){
    this.Paso=2;
    this.Caso='B'
    this._ChatAtencionClienteService.ObtenerCursosAlumnoMatriculado().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosMatricula=x
        this.CursosPadreMatricula=this.CursosMatricula.cursosPadre
        this.CursosHijoMatricula=this.CursosMatricula.cursosHijo
        console.log(this.CursosPadreMatricula)
        console.log(this.CursosHijoMatricula)
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
  EnviarFormularioAtc(CursoHijo:any){
    console.log(CursoHijo)
  }
  ObtenerCursosIdArea(Area:any){
    console.log(Area)
    this.AreasCapacitacion=[];
      this._ChatAtencionClienteService.ListaProgramasFiltroChatAtc(Area.id).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.CursosPorArea=x
          console.log(this.CursosPorArea)
        },
        complete:()=>{
          this.Paso=2
          this.Caso='A'
        }
      })
  }
}
