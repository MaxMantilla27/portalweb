import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ValidacionChatEnvioDTO, ValidacionChatFormularioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { ChatEnLineaService } from '../../Services/ChatEnLinea/chat-en-linea.service';
import { SessionStorageService } from '../../Services/session-storage.service';
import { SnackBarServiceService } from '../../Services/SnackBarService/snack-bar-service.service';
import { FacebookPixelService } from '../../Services/FacebookPixel/facebook-pixel.service';
import { RegionService } from '../../Services/Region/region.service';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { DatosPortalService } from '../../Services/DatosPortal/datos-portal.service';
import { FormularioRojoComponent } from '../formulario-rojo/formulario-rojo.component';
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
  @ViewChild(FormularioRojoComponent)
  form!: FormularioRojoComponent;
  constructor(
    private _ChatEnLinea: ChatEnLineaService,
    private _RegionService: RegionService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _SessionStorageService:SessionStorageService,
    @Inject(PLATFORM_ID) platformId: Object,
    private _DatosPortalService: DatosPortalService,
    private _FacebookPixelService:FacebookPixelService
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
  public CompleteLocalStorage=false;
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
  ngOnInit(): void {
    this.AddFields();
    this.obtenerFormularioCompletado();
    this.ObtenerCombosPortal();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  userForm!: FormGroup;
  obtenerFormularioCompletado(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.formularioContactoChat.Nombres=datos.nombres;
      this.formularioContactoChat.Apellidos=datos.apellidos;
      this.formularioContactoChat.Email=datos.email;
      this.formularioContactoChat.Movil=datos.movil;
      this.CompleteLocalStorage=true;
    }
    else{
      this.CompleteLocalStorage=false;
    }
  }
  SetContacto(value: any) {
    if (!this.formVal || this.statuscharge==true) {
      // this._SnackBarServiceService.openSnackBar(
      //   'Debes completar todos los campos',
      //   'x',
      //   10,
      //   'snackbarCrucigramaerror'
      // );
    } else {
      this.statuscharge=true;
      this.initValues = false;
      this.DatosEnvioFormulario.Nombres = value.Nombres;
      this.DatosEnvioFormulario.Apellidos = value.Apellidos;
      this.DatosEnvioFormulario.Email = value.Email;
      this.DatosEnvioFormulario.Movil = value.Movil;
      this.DatosEnvioFormulario.EstadoAsesor = '0';
      this.DatosEnvioFormulario.IdPrograma = this.IdPGeneral;
      var IdPespecifico=this._SessionStorageService.SessionGetValueCokies("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueCokies("idCategoria");
      var idcampania=this._SessionStorageService.SessionGetValueCokies("idCampania");
      this.DatosEnvioFormulario.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);

      if(this.IdPespecificoPrograma==0 || this.IdPespecificoPrograma==null || this.IdPespecificoPrograma==undefined){
        this.DatosEnvioFormulario.IdPespecifico=parseInt(IdPespecifico)
      }else{
        this.DatosEnvioFormulario.IdPespecifico=this.IdPespecificoPrograma
      };
      this.DatosEnvioFormulario.IdCampania=parseInt(idcampania)
      this._ChatEnLinea.ValidarCrearOportunidadChat(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$)).subscribe({
        next:(x)=>{
          this.ProcesarAsignacionAutomaticaNuevoPortal(x);
          this.statuscharge = false;
          this.validacionChat=x
          this.SaveForm.emit({id:x.respuesta.id,idAlumno:x.respuesta.idAlumno})
          this.datos.nombres = this.DatosEnvioFormulario.Nombres;
          this.datos.apellidos = this.DatosEnvioFormulario.Apellidos;
          this.datos.email = this.DatosEnvioFormulario.Email;
          this.datos.movil = this.DatosEnvioFormulario.Movil;
          var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
          if(DatosFormulario!=''){
            var datosPrevios = JSON.parse(DatosFormulario);
            this.datos.idCargo=datosPrevios.idCargo;
            this.datos.idPais=datosPrevios.idPais;
            this.datos.idRegion=datosPrevios.idRegion;
            this.datos.idAreaFormacion=datosPrevios.idAreaFormacion;
            this.datos.idAreaTrabajo=datosPrevios.idAreaTrabajo;
            this.datos.idIndustria=datosPrevios.idIndustria;
          }
          this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
          this.CompleteLocalStorage=true;
          if(this.isBrowser){
            fbq('trackSingle','269257245868695', 'Lead', {}, {eventID:x.respuesta.id});
            this._FacebookPixelService.SendLoad(x.respuesta.id,x.respuesta.correoEnc,x.respuesta.telEnc,x.respuesta.userAgent,x.respuesta.userIp).subscribe({
              next:(x)=>{
                console.log(x)
              },
              error:(e)=>{
                console.log(e)
              }
            });
            gtag('event', 'conversion', {
              'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
            });
            gtag('event', 'conversion', {
                'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
            });
            gtag('event', 'conversion', {
              'send_to': 'AW-11065656821/6CM8CNWQ2IcYEPWLwpwp',
            });
          }
        },
        complete: () => {
          this.obtenerFormularioCompletado();
        },
      })
    }
  }
  GetLocalidadPorRegion(idRegion:number){
    this._RegionService.ObtenerLocalidadPorRegion(idRegion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if (x.length != 0 && x != undefined && x !=null ) {

          this.fileds.forEach(r=>{
            if(r.nombre=='IdLocalidad'){
              r.disable=false;
              r.hiden=false;
              r.data=x.map((p:any)=>{
                var ps:Basic={Nombre:p.nombreLocalidad,value:p.idLocalidad,longitudCelular:p.longitudCelular,codigo:p.codigo};
                return ps;
              })
              r.validate=[Validators.required];
            }
          })
          this.form.enablefield('IdLocalidad');
        }
        else{
          this.fileds.forEach(r=>{
            if(r.nombre=='IdLocalidad'){
              r.disable=true;
              r.hiden=true;
              r.validate=[];
            }
          })

        }
      }
    })
  }
  GetLocalidadSeleccion(idLocalidad:number){

    console.log('localidadPrueba',idLocalidad)
  }
  SelectChage(e:any){
    console.log('form')
    if(e.Nombre =="IdPais"){
    //   (<FormArray>this.userForm.get('Fields')).controls[3].get("IdPais")?.setValue(   {
    //     "Nombre": "Mexico",
    //     "value": 52
    // });
      this.GetRegionesPorPais(e.value)
    }
    if(e.Nombre == "IdRegion"){
      this.GetLocalidadPorRegion(e.value)
    }


  }
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.fileds.forEach(r=>{
          if(r.nombre=='IdRegion'){
            r.disable=false;
            r.data=x.map((p:any)=>{
              var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
              return ps;
            })
          }
        })
        this.form.enablefield('IdRegion');
      }
    })
  }
  listaValida:any;
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.listaValida = x.listaLocalida.map((p:any)=>String(p.codigo));
        console.log(x);
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data=x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
          }
        })
      }
    })
    this.initValues = true;
  }

  ProcesarAsignacionAutomaticaNuevoPortal(data:any){
    this._ChatEnLinea.ProcesarAsignacionAutomaticaNuevoPortal(data.respuesta.id).subscribe({
      next:(x)=>{
      },
      complete: () => {
        //this.statuscharge=false;
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
    this.fileds.push({
      nombre: 'IdPais',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      disable: false,
      label: 'Pais',
    });

    this.fileds.push({
      nombre: 'IdRegion',
      tipo: 'select',
      valorInicial: '',
      validate: [],
      disable: true,
      label: 'Región',
      hiden:true
    });
    this.fileds.push({
      nombre: 'IdLocalidad',
      tipo: 'select',
      valorInicial: '',
      validate: [],
      disable: true,
      label: 'Localidad',
      hiden:true
    });
  }
  LimpiarCampos(){
    this.CompleteLocalStorage=false;
    this._SessionStorageService.SessionDeleteValue('DatosFormulario');
    this.DatosEnvioFormulario.Nombres= '';
    this.DatosEnvioFormulario.Apellidos= '';
    this.DatosEnvioFormulario.Email= '';
    this.DatosEnvioFormulario.Movil= '';
  }
}
