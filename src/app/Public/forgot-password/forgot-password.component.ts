import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { formulario } from 'src/app/Core/Models/Formulario';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor() { }
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
    console.log(e)
  }
}
