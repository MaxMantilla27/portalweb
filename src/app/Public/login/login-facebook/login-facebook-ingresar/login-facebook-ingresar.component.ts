import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { loginSendDTO, login, loginSendFacebookDTO } from 'src/app/Core/Models/login';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { AlumnoService } from 'src/app/Core/Shared/Services/Alumno/alumno.service';
import { AspNetUserService } from 'src/app/Core/Shared/Services/AspNetUser/asp-net-user.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-login-facebook-ingresar',
  templateUrl: './login-facebook-ingresar.component.html',
  styleUrls: ['./login-facebook-ingresar.component.scss']
})
export class LoginFacebookIngresarComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private router: Router,
    private _AspNetUserService:AspNetUserService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _FormaPagoService:FormaPagoService,
    public dialog: MatDialog,
    private title:Title,
    private meta:Meta,
    private _AccountService:AccountService,
    private _AlumnoService: AlumnoService,
    private _SnackBarServiceService:SnackBarServiceService
    ) { }
  formVal:boolean=false;
  statuscharge=false;
  initValues=false
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  @Input() data:loginSendFacebookDTO={
    Email:'',
    IdFacebook:'',
    Token:'',
    DataFacebook:'',
    msj:'',
  };
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public migaPan: any = [];
  public loginSend:loginSendDTO={password:'',username:''}
  login:login={
    Email:"",
    Password:"",
    Recordar:false,
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
  @Output() OnClose = new EventEmitter<any>();
  ngOnInit(): void {
    let t:string='Iniciar Sesión'
    this.title.setTitle(t);
    this.meta.addTag({name: 'author', content: 'BSG Institute'})

    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Iniciar Sesión',
        urlWeb: '/login'
      }
    ]
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
    this.fileds.push({
      nombre:"Recordar",
      tipo:"checkbox",
      valorInicial:"",
      validate:[],
      label:"¿Recordar cuenta?",
      style:"font-size: 12px;color: #7d7d7c;"
    });
  }
  Login(value:any){
    if(this.formVal){
      console.log(value)
      //this.statuscharge=true
      //this.login=value;
      this.loginSend.password=value.Password;
      this.loginSend.username=value.Email;
      this._AspNetUserService.Authenticate(this.loginSend).subscribe({
        next:x=>{
          console.log(x)
          this.statuscharge=false
          this._SessionStorageService.SetToken(x.token)

          this._AspNetUserService.GuardarLoginFacebook(this.data).subscribe({
            next:x=>{
              console.log(x);
            }
          })
          console.log('entra')
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
          console.log('sale')
          this.DatoObservable.datoAvatar=true
          this.DatoObservable.datoContenido=true
          this._HelperService.enviarDatoCuenta(this.DatoObservable)
          console.log(this.DatoObservable);
          this._SessionStorageService.SessionSetValue('IdProveedor',x.idProveedor);
          this._SessionStorageService.SessionSetValue('Cursos',x.cursos);
          var redirect=this._SessionStorageService.SessionGetValue('redirect');
          var normal=true;
          if(redirect!=''){
            if(redirect=='pago'){
              var jsonEnvioPago=this._SessionStorageService.SessionGetValue('datosTarjeta');
              if(jsonEnvioPago!=''){
                normal=false;
                this._FormaPagoService.PreProcesoPagoOrganicoAlumno(JSON.parse(jsonEnvioPago),null);
              }
            }
            this._SessionStorageService.SessionDeleteValue('redirect');
          }
          if(normal){
            var ap=this._SessionStorageService.SessionGetValueSesionStorage('accesoPrueba');
            if(ap==''){
              this.OnClose.emit();
              if(x.idProveedor==0){
                this.router.navigate(['/AulaVirtual/MisCursos']);
              }else{
                if(x.cursos==0){
                  this.router.navigate(['/AulaVirtual/Docencia']);
                }else{
                  this.router.navigate(['/AulaVirtual/MisCursos']);
                }
              }
            }else{
              this._AccountService.RegistroCursoAulaVirtualNueva(parseInt(ap)).pipe(takeUntil(this.signal$)).subscribe({
                next:x=>{
                  this._SessionStorageService.SessionDeleteValueSesionStorage('accesoPrueba')
                  if(x.idProveedor==0){
                    this.router.navigate(['/AulaVirtual/MisCursos']);
                  }else{
                    if(x.cursos==0){
                      this.router.navigate(['/AulaVirtual/Docencia']);
                    }else{
                      this.router.navigate(['/AulaVirtual/MisCursos']);
                    }
                  }
                  this.OnClose.emit();
                },
              })
            }
          }else{
            this.OnClose.emit();
          }
        },
        error:e=>{
          this.statuscharge=false
          console.log(e)
          this._SnackBarServiceService.openSnackBar(
            e.error.excepcion.descripcionGeneral,
            'x',
            5,
            'snackbarCrucigramaerror'
          );
        },
        complete:()=>{
          this.statuscharge=false
        }
      });


    }

  }
}
