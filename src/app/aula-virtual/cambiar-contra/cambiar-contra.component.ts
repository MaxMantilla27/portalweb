import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CambioPasswordDTO } from 'src/app/Core/Models/AccountDTO';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { ConfirmedValidator } from 'src/app/Core/Shared/Validators/ConfirmedValidator';

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.component.html',
  styleUrls: ['./cambiar-contra.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CambiarContraComponent implements OnInit {
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _AccountService: AccountService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router
  ) {
    this.userForm = fb.group({
      contraActual: ['', [Validators.required]],
      contraNueva: ['', [Validators.required, Validators.minLength(6)]],
      contraNuevaRepeat: ['', [Validators.required, ConfirmedValidator('')]],
    });
  }

  public migaPan = [
    {
      titulo: 'Cambiar Contraseña',
      urlWeb: '/AulaVirtual/ChangePassword',
    },
  ];
  public datos: CambioPasswordDTO = {
    ConfirmPassword: '',
    NewPassword: '',
    OldPassword: '',
  };
  ngOnInit(): void {}
  CambiarContra() {
    if(this.userForm.valid){
      this.datos.ConfirmPassword = this.userForm.get('contraNuevaRepeat')?.value;
      this.datos.OldPassword = this.userForm.get('contraActual')?.value;
      this.datos.NewPassword = this.userForm.get('contraNueva')?.value;
      this._AccountService.ActualizarPasswordCuenta(this.datos).subscribe({
        next:x=>{
          this._SessionStorageService.DeleteToken();
          this._router.navigate(['/login']);
        },
        error:e=>{
          console.log(e);

        }
      })
    }
  }
  passwordChange() {
    this.userForm.controls['contraNuevaRepeat'].clearValidators();
    this.userForm.controls['contraNuevaRepeat'].setValidators([
      ConfirmedValidator(this.userForm.get('contraNueva')?.value),
    ]);
  }
  get f() {
    return this.userForm.controls;
  }
  obtenerErrorCampoNombre(val: string) {
    var campo = this.userForm.get(val);

    if (campo!.hasError('required')) {
      return 'El campo es requerido';
    }

    if (campo!.hasError('ConfirmedValidator')) {
      return 'La contraseña ingesada debe ser igual a su nueva contraseña';
    }
    return '';
  }
}
