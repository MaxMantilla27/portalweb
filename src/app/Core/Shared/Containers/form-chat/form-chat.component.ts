import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ValidacionChatEnvioDTO, ValidacionChatFormularioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { ChatEnLineaService } from '../../Services/ChatEnLinea/chat-en-linea.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';
declare const fbq:any;
declare const gtag:any;
@Component({
  selector: 'app-form-chat',
  templateUrl: './form-chat.component.html',
  styleUrls: ['./form-chat.component.scss']
})
export class FormChatComponent implements OnInit,OnChanges {
  private signal$ = new Subject();

  isBrowser: boolean;
  constructor(
    private _ChatEnLinea: ChatEnLineaService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _SessionStorageService:SessionStorageService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdPGeneral=0;
  @Input() IdPespecificoPrograma=0;
  public chatInicial=false;
  public chatOpen=false;
  public initValues = false;
  public validacionChat = false;
  public nombreAsesor:any;
  public nombre1='';
  public apellido1='';
  statuscharge = false;
  formVal: boolean = false;
  public fileds: Array<formulario> = [];
  public formularioContactoChat: ValidacionChatFormularioDTO = {
    Email: '',
    Nombres: '',
    Apellidos: '',
    Movil: '',
  };
  public DatosEnvioFormulario: ValidacionChatEnvioDTO = {
    Email: '',
    Nombres: '',
    Apellidos: '',
    Movil: '',
    IdPrograma:0,
    EstadoAsesor:'',
  };
  @Output() SaveForm:EventEmitter<{id:string,idAlumno:number}> = new EventEmitter<{id:string,idAlumno:number}>();
  ngOnInit(): void {
    this.AddFields()
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  SetContacto(value: any) {
    if (!this.formVal) {
      // this._SnackBarServiceService.openSnackBar(
      //   'Debes completar todos los campos',
      //   'x',
      //   10,
      //   'snackbarCrucigramaerror'
      // );
    } else {
      this.initValues = false;
      this.DatosEnvioFormulario.Nombres = value.Nombres;
      this.DatosEnvioFormulario.Apellidos = value.Apellidos;
      this.DatosEnvioFormulario.Email = value.Email;
      this.DatosEnvioFormulario.Movil = value.Movil;
      this.DatosEnvioFormulario.EstadoAsesor = '0';
      this.DatosEnvioFormulario.IdPrograma = this.IdPGeneral;
      var IdPespecifico=this._SessionStorageService.SessionGetValueSesionStorage("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueSesionStorage("idCategoria");
      this.DatosEnvioFormulario.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);
      if(IdPespecifico==''){
        this.DatosEnvioFormulario.IdPespecifico=this.IdPespecificoPrograma
      }else{
        this.DatosEnvioFormulario.IdPespecifico=parseInt(IdPespecifico)
      };
      this._ChatEnLinea.ValidarCrearOportunidadChat(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$)).subscribe({
        next:(x)=>{

          if(this.isBrowser){
            console.log('------------------facebook(true)---------------------------');
            console.log(fbq);
            fbq('track', 'CompleteRegistration');
            gtag('event', 'conversion', {
              'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
            });
            gtag('event', 'conversion', {
                'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
            });
          }
          console.log(x);
          this.validacionChat=x
          this.SaveForm.emit({id:x.respuesta.id,idAlumno:x.respuesta.idAlumno})
        }
      })
    }
  }

  AddFields() {
    this.fileds.push({
      nombre: 'Email',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required, Validators.email],
      label: 'E-mail',
    });
    this.fileds.push({
      nombre: 'Nombres',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Nombres',
    });
    this.fileds.push({
      nombre: 'Apellidos',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Apellidos',
    });
    this.fileds.push({
      nombre: 'Movil',
      tipo: 'phone',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Teléfono Móvil',
    });
  }
}
