import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ValidacionChatEnvioDTO, ValidacionChatFormularioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { ChatEnLineaService } from '../../Services/ChatEnLinea/chat-en-linea.service';
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

  constructor(
    private _ChatEnLinea: ChatEnLineaService,
    private _SnackBarServiceService: SnackBarServiceService,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdPGeneral=0;
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
      this.DatosEnvioFormulario.EstadoAsesor = '1';
      this.DatosEnvioFormulario.IdPrograma = this.IdPGeneral;
      this._ChatEnLinea.ValidarCrearOportunidadChat(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$)).subscribe({
        next:(x)=>{
          console.log('------------------facebook(true)---------------------------');
          console.log(fbq);
          fbq('track', 'CompleteRegistration');
          gtag('event', 'conversion', {
            'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
          });
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
