import { style } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { login, loginSendDTO } from 'src/app/Core/Models/login';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { AspNetUserService } from 'src/app/Core/Shared/Services/AspNetUser/asp-net-user.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

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
    private title:Title,
    private meta:Meta,
    private _AccountService:AccountService
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
      })

    }

  }
  eventoclickout(olo:string){
    console.log(olo)
  }

}
