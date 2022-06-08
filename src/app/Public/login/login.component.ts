import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { login, loginSendDTO } from 'src/app/Core/Models/login';
import { AspNetUserService } from 'src/app/Core/Shared/Services/AspNetUser/asp-net-user.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private _AspNetUserService:AspNetUserService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,

    ) { }
  formVal:boolean=false;
  statuscharge=false;
  initValues=false
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
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
      label:"E-mail",

    });
    this.fileds.push({
      nombre:"Password",
      tipo:"password",
      valorInicial:"",
      validate:[Validators.required],
      label:"Password"
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
    console.log(value)
    this.statuscharge=true
    this.login=value;
    this.loginSend.password=this.login.Password;
    this.loginSend.username=this.login.Email;
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
        if(x.idProveedor==0){
          this.router.navigate(['/AulaVirtual/MiPerfil']);
        }else{
          if(x.cursos==0){
            this.router.navigate(['/AulaVirtual/Docencia']);
          }else{
            this.router.navigate(['/AulaVirtual/MiPerfil']);
          }
        }
      },
      error:e=>{
        this.statuscharge=false
        console.log(e)
        this.errorLogin=e.error.excepcion.descripcionGeneral;
        setTimeout(()=>{
          this.errorLogin='';
        },10000);
      },
      complete:()=>{
        this.statuscharge=false
      }
    })


  }
  eventoclickout(olo:string){
    console.log(olo)
  }

}
