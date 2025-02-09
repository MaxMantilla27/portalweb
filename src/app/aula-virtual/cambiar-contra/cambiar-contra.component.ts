import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CambioPasswordDTO } from 'src/app/Core/Models/AccountDTO';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { InteraccionFormularioCampoDTO } from 'src/app/Core/Models/Interacciones';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { ConfirmedValidator } from 'src/app/Core/Shared/Validators/ConfirmedValidator';

@Component({
  selector: 'app-cambiar-contra',
  templateUrl: './cambiar-contra.component.html',
  styleUrls: ['./cambiar-contra.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CambiarContraComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _AccountService: AccountService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    private _SnackBarServiceService: SnackBarServiceService,
    private _HelperService: HelperService,
    private title:Title
  ) {
    this.userForm = fb.group({
      contraActual: ['', [Validators.required]],
      contraNueva: ['', [Validators.required, Validators.minLength(6)]],
      contraNuevaRepeat: ['', [Validators.required, ConfirmedValidator('')]],
    });
  }

  public jsonForm:InteraccionFormularioCampoDTO={
    Acciones:[],
    AccionesJson:{},
    IdCategoriaOrigen:null,
    IdConjuntoAnuncio:null,
    IdInteraccionPortalPaginaV2:0,
    IdTipoInteraccionPortalFormulario:0,
    IdInteraccionPortalV2:0,
    Nombre:''
  }
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
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
  ngOnInit(): void {
    let t:string='Cambiar Contraseña'
    this.title.setTitle(t)
  }
  CambiarContra() {
    this.EnviarInteraccion(true)
    if(this.userForm.valid){
      this.datos.ConfirmPassword = this.userForm.get('contraNuevaRepeat')?.value;
      this.datos.OldPassword = this.userForm.get('contraActual')?.value;
      this.datos.NewPassword = this.userForm.get('contraNueva')?.value;
      this._AccountService.ActualizarPasswordCuenta(this.datos).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          if(x.descripcionGeneral!=undefined){
            this._SnackBarServiceService.openSnackBar(
              x.descripcionGeneral,
              'x',
              10,
              'snackbarCrucigramaerror'
            );
            this.userForm.reset()
            this._HelperService.enviarDatoCuenta(this.DatoObservable);
          }else{
            this._SnackBarServiceService.openSnackBar("Se cambio su contraseña",'x',15,"snackbarCrucigramaSucces");
            this._SessionStorageService.DeleteToken();
            this._router.navigate(['/login']);
          }
        },
        error:e=>{

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
      if(val=='contraActual'){
        return 'Ingresa tu contraseña actual';
      }
      if(val=='contraNueva'){
        return 'Ingresa tu nueva contraseña';
      }
      if(val=='contraNuevaRepeat'){
        return 'Confirma tu nueva contraseña';
      }
    }

    if (campo!.hasError('ConfirmedValidator')) {
      return 'La contraseña ingesada debe ser igual a su nueva contraseña';
    }
    return '';
  }
  EnviarInteraccion(enviado:boolean){
    let objInteraccion:Array<any>=[];

    objInteraccion.push({
      Tag:'Input',
      Tipo:'text',
      Nombre:'Contraseña Actual',
      valor:this.userForm.get('contraActual')?.value
    })

    objInteraccion.push({
      Tag:'Input',
      Tipo:'text',
      Nombre:'Nueva Contraseña',
      valor:this.userForm.get('contraNueva')?.value
    })

    objInteraccion.push({
      Tag:'Input',
      Tipo:'text',
      Nombre:'Confirma Nueva Contraseña',
      valor:this.userForm.get('contraNuevaRepeat')?.value
    })
    console.log(this.userForm)
    var tipo=0;
    if(enviado){
      if(this.userForm.valid==true){
        tipo=4
      }else{
        tipo=3
      }
    }else{
      if(this.userForm.valid==true){
        tipo=2
      }else{
        tipo=1
      }
    }
    this.jsonForm.AccionesJson=objInteraccion;
    this.jsonForm.IdCategoriaOrigen=this._SessionStorageService.SessionGetValueCokies("idCategoria");
    this.jsonForm.IdConjuntoAnuncio=this._SessionStorageService.SessionGetValueCokies("idCampania")
    this.jsonForm.IdTipoInteraccionPortalFormulario=tipo
    this.jsonForm.Nombre='Cambiar Contraseña'
    this._HelperService.enviarMsjForm(this.jsonForm);
  }
}
