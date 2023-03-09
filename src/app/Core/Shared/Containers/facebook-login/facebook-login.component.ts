import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subject, takeUntil } from 'rxjs';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { loginSendFacebookDTO } from 'src/app/Core/Models/login';
import { AccountService } from '../../Services/Account/account.service';
import { AlumnoService } from '../../Services/Alumno/alumno.service';
import { AspNetUserService } from '../../Services/AspNetUser/asp-net-user.service';
import { FormaPagoService } from '../../Services/FormaPago/forma-pago.service';
import { HelperService } from '../../Services/helper.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.scss']
})
export class FacebookLoginComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();
  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean = undefined;
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
  public loginSend:loginSendFacebookDTO={Email:'',IdFacebook:'',DataFacebook:'',Token:'',msj:''}
  constructor(
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private _AspNetUserService:AspNetUserService,
    private _SessionStorageService:SessionStorageService,
    private _AlumnoService: AlumnoService,
    private _FormaPagoService:FormaPagoService,
    private router: Router,
    private _HelperService: HelperService,
    private _AccountService:AccountService,
    private _SnackBarServiceService: SnackBarServiceService,
  ) { }
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  public EnLOgueo=false

  @Output() OnError = new EventEmitter<any>();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.socialAuthService.authState.subscribe({
      next:x=>{
        console.log(x)
        this.socialUser = x;
        this.loginSend.Email=this.socialUser.email==undefined?'':this.socialUser.email
        this.loginSend.IdFacebook=this.socialUser.id
        this.loginSend.Token=this.socialUser.authToken
        this.loginSend.DataFacebook=JSON.stringify(x)
        if(this.EnLOgueo==true){
          this.Login();
        }
        console.log(this.socialUser.email)
        this.isLoggedin = x != null;
      }
    });
    this.socialAuthService.initState
  }

  loginWithFacebook(): void {
    this.EnLOgueo=true
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.socialAuthService.signOut();
  }
  Login(){
    this._AspNetUserService.AuthenticateFacebook(this.loginSend).subscribe({
      next:x=>{
        console.log(x)
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
        console.log(e)

        // this._SnackBarServiceService.openSnackBar(
        //   e.error.excepcion.descripcionGeneral,
        //   'x',
        //   5,
        //   'snackbarCrucigramaInfo'
        // );
        //this.socialAuthService.signOut();
        this.loginSend.msj=e.error.excepcion.descripcionGeneral;
        this.OnError.emit(this.loginSend)
      },
      complete:()=>{
        this.EnLOgueo=false
      }
    });

  }
}
