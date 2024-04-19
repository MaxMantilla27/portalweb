import { style } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { login, loginSendDTO, loginSendFacebookDTO } from 'src/app/Core/Models/login';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { AlumnoService } from 'src/app/Core/Shared/Services/Alumno/alumno.service';
import { AspNetUserService } from 'src/app/Core/Shared/Services/AspNetUser/asp-net-user.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { LoginFacebookComponent } from './login-facebook/login-facebook.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
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

    ) { }
  formVal:boolean=false;
  statuscharge=false;
  initValues=false
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public migaPan: any = [];
  public loginSend:loginSendDTO={password:'',username:''}
  public errorLogin=''
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
          this._SessionStorageService.SessionSetValue('TipoCarrera',x.tipoCarrera);
          var redirect=this._SessionStorageService.SessionGetValue('redirect');
          console.log(redirect)
          var normal=true;
          if(redirect=='pago'){
            this._SessionStorageService.SessionDeleteValue('redirect');
            console.log('================ANDA A PAGARRRRRRRRRRRR')
            this.router.navigate(['/AulaVirtual/MisPagos/PagoOrganicoTodos']);
          }
          else{
            var ap=this._SessionStorageService.SessionGetValueSesionStorage('accesoPrueba');
          if(ap==''){
            console.log('=================SE VA A NORMALITO1')

            if(x.idProveedor==0){
              this.router.navigate(['/AulaVirtual/MisCursos']);
            }else{
              if(x.cursos==0){
                this.router.navigate(['/AulaVirtual/DocenciaV2']);
              }else{
                this.router.navigate(['/AulaVirtual/MisCursos']);
              }
            }
          }
          else{
            console.log('=================SE VA A NORMALITO2')

            this._AccountService.RegistroCursoAulaVirtualNueva(parseInt(ap)).pipe(takeUntil(this.signal$)).subscribe({
              next:x=>{
                this._SessionStorageService.SessionDeleteValueSesionStorage('accesoPrueba')
                if(x.idProveedor==0){
                  this.router.navigate(['/AulaVirtual/MisCursos']);
                }else{
                  if(x.cursos==0){
                    this.router.navigate(['/AulaVirtual/DocenciaV2']);
                  }else{
                    this.router.navigate(['/AulaVirtual/MisCursos']);
                  }
                }
              },
            })
          }
          }

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
        }
      });


    }

  }
  eventoclickout(olo:string){
    console.log(olo)
  }
  OpenModalLogin(data:loginSendFacebookDTO){
    const dialogRef = this.dialog.open(LoginFacebookComponent, {
      width: '900px',
      data: data,
      panelClass: 'login-facebook-dialog-container',
      disableClose:true
    });
    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){

      }
    });
  }
}
