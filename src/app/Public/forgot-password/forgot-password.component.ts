import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { formulario } from 'src/app/Core/Models/Formulario';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    public _AccountService:AccountService,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  formVal:boolean=false;
  statuscharge=false;
  public emailSend:any={email:''}
  email:any={
    email:""
  };
  fileds:Array<formulario>=[];
  public errorLogin=''
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: '¿Olvidó su contraseña?',
      urlWeb: '/Account/ForgotPassword'
    }
  ]
  ngOnInit(): void {
    this.fileds.push({
      nombre:"email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"Correo electrónico",

    });
  }
  ForgotPassword(e:any){
    this._AccountService.RecuperarPasswordCuenta(e.email).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.excepcionGenerada==false){
          this._SnackBarServiceService.openSnackBar(x.descripcionGeneral,'x',15,"snackbarCrucigramaSucces");
        }else{

          this._SnackBarServiceService.openSnackBar(x.descripcionGeneral,'x',10,"snackbarCrucigramaerror");
        }
      }
    })
  }
}
