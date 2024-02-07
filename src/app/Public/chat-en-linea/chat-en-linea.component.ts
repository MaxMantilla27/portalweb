import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ValidacionChatEnvioDTO, ValidacionChatFormularioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { ChatEnLineaService } from 'src/app/Core/Shared/Services/ChatEnLinea/chat-en-linea.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-chat-en-linea',
  templateUrl: './chat-en-linea.component.html',
  styleUrls: ['./chat-en-linea.component.scss']
})
export class ChatEnLineaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private _ChatEnLinea: ChatEnLineaService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _HelperService: HelperService,


  ) { this.userForm =fb.group({
    Mensaje: ['', [Validators.required]],
  });
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public message ='';
  public messages:any;
  @Input() IdPGeneral=0;
  public chatInicial=false;
  public chatOpen=false;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public validacionChat = false;
  public nombreAsesor:any;
  public nombre1='';
  public apellido1='';

  public fileds: Array<formulario> = [];
  public formularioContactoChat: ValidacionChatFormularioDTO = {
    Email: '',
    Nombres: '',
    Apellidos: '',
    Movil: '',
    IdPais:0,
    IdRegion:0,
    IdLocalidad:0
  };
  public DatosEnvioFormulario: ValidacionChatEnvioDTO = {
    Email: '',
    Nombres: '',
    Apellidos: '',
    Movil: '',
    IdPrograma:0,
    EstadoAsesor:'',
  };
  public combosPrevios:any
  ngOnInit(): void {
    /* this.ObtenerConfiguracionChat(); */
      this.AddFields();
      this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
        this.combosPrevios=x.datosAlumno;
        this.formularioContactoChat.Nombres= this.combosPrevios.nombres,
        this.formularioContactoChat.Apellidos= this.combosPrevios.apellidos,
        this.formularioContactoChat.Email= this.combosPrevios.email,
        this.formularioContactoChat.Movil= this.combosPrevios.telefono
      })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdPGeneral!=0){
      this.ObtenerAsesorChat();
    }
  }

  /* ObtenerConfiguracionChat(){
    this._ChatEnLinea.ObtenerConfiguracionChat().subscribe({
      next: (x) => {
      }
    })
  } */

  SetContacto(value: any) {
    if (!this.formVal) {
      this._SnackBarServiceService.openSnackBar(
        'Debes completar todos los campos',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
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
          this.validacionChat=x
        //  this.ProcesarAsignacionAutomaticaNuevoPortal(x);
        }
      })
    }
  }
  ProcesarAsignacionAutomaticaNuevoPortal(data:any){
    this._ChatEnLinea.ProcesarAsignacionAutomaticaNuevoPortal(data.respuesta.id).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
      }
    })
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
  LimpiarCampos(){
    this.combosPrevios=undefined;
    this.formularioContactoChat.Nombres= '',
      this.formularioContactoChat.Apellidos= '',
      this.formularioContactoChat.Email= '',
      this.formularioContactoChat.Movil= ''
  }
  ObtenerAsesorChat(){
    this._ChatEnLinea.ObtenerAsesorChat(this.IdPGeneral).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.nombreAsesor=x.nombreAsesor;
        var Asesor = this.nombreAsesor.split(' ');
        this.nombre1 = Asesor[0];
        this.apellido1 =Asesor[2];
      }
    })
  }
  EnviarMensajeChat(){

  }
}

