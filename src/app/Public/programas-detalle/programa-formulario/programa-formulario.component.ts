import { Component, OnInit, ViewEncapsulation,Inject, OnDestroy,PLATFORM_ID, ViewChild, } from '@angular/core';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { ProgramasDetalleComponent } from '../programas-detalle.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { isPlatformBrowser } from '@angular/common';
import { FormularioContactoShortDTO } from 'src/app/Core/Models/FormularioDTO';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from 'src/app/Core/Shared/Services/Helper/helper.service';
import { HelperService as Help} from 'src/app/Core/Shared/Services/helper.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { Validators } from '@angular/forms';
import { FormularioAzulComponent } from 'src/app/Core/Shared/Containers/formulario-azul/formulario-azul.component';
import { FormularioPopUpComponent } from 'src/app/Core/Shared/Containers/formulario-pop-up/formulario-pop-up.component';
import { ChatEnLineaService } from 'src/app/Core/Shared/Services/ChatEnLinea/chat-en-linea.service';
import { FacebookPixelService } from 'src/app/Core/Shared/Services/FacebookPixel/facebook-pixel.service';

declare const fbq:any;
declare const gtag:any;


@Component({
  selector: 'app-programa-formulario',
  templateUrl: './programa-formulario.component.html',
  styleUrls: ['./programa-formulario.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ProgramaFormularioComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  isBrowser: boolean;
  @ViewChild(FormularioPopUpComponent)
  form!: FormularioPopUpComponent;

  constructor(
    public dialogRef: MatDialogRef<ProgramasDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) platformId: Object,
    private _SnackBarServiceService: SnackBarServiceService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _HelperServiceP:Help,
    private _RegionService: RegionService,
    private _DatosPortalService: DatosPortalService,

    private _FacebookPixelService:FacebookPixelService,
    private _ChatEnLineaService:ChatEnLineaService


  ) {
    this.isBrowser = isPlatformBrowser(platformId);
   }

  public statuscharge = false;
  public formVal: boolean = false;
  public initValues = false;
  public cleanSub=false
  public CompleteLocalStorage=false;
  public fileds: Array<formulario> = [];
  public combosPrevios:any;
  public Paises:any;
  public listaLocalidades?:any;

  public formularioContacto: FormularioContactoShortDTO = {
    Nombres: '',
    Apellidos: '',
    Email: '',
    IdPais: undefined,
    IdRegion: undefined,
    Movil: '',
    IdLocalidad: undefined
  };
  public DatosEnvioFormulario: ContactenosDTO = {
    Nombres: '',
    Apellidos: '',
    Correo1: '',
    IdPais: undefined,
    IdRegion:undefined,
    Movil: '',
    IdCargo: undefined,
    IdAreaFormacion: undefined,
    IdAreaTrabajo: undefined,
    IdIndustria: undefined,
  };
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
    idLocalidad:undefined,
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    this._HelperServiceP.recibirChangePais().pipe(takeUntil(this.signal$)).subscribe((x) => {
      if (this.isBrowser) {
        location.reload();
      }
    });
    this._HelperServiceP.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.Paises=x;
      }
    })
    this.obtenerFormularioCompletado();
    this.AddFields();
    this.ObtenerCombosPortal();
  }

  SetContacto(value: any) {
    if (!this.formVal) {
      this._SnackBarServiceService.openSnackBar(
        'Debes completar todos los campos',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
    } else {
      this.statuscharge=true;
      this.initValues = false;
      this.DatosEnvioFormulario.Nombres = value.Nombres;
      this.DatosEnvioFormulario.Apellidos = value.Apellidos;
      this.DatosEnvioFormulario.Correo1 = value.Email;
      this.DatosEnvioFormulario.IdPais = value.IdPais;
      this.DatosEnvioFormulario.IdRegion = value.IdRegion;
      this.DatosEnvioFormulario.Movil = value.Movil;
      this.DatosEnvioFormulario.IdCargo = value.IdCargo;
      this.DatosEnvioFormulario.IdAreaFormacion = value.IdAreaFormacion;
      this.DatosEnvioFormulario.IdAreaTrabajo = value.IdAreaTrabajo;
      this.DatosEnvioFormulario.IdIndustria = value.IdIndustria;
      var IdPEspecifico=this._SessionStorageService.SessionGetValueCokies("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueCokies("idCategoria");
      var idcampania=this._SessionStorageService.SessionGetValueCokies("idCampania");
      this.DatosEnvioFormulario.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);

      if(this.data.IdPespecificoPrograma==0 || this.data.IdPespecificoPrograma==null || this.data.IdPespecificoPrograma==undefined){
        this.DatosEnvioFormulario.IdPespecifico=parseInt(IdPEspecifico)
      }else{
        this.DatosEnvioFormulario.IdPespecifico=this.data.IdPespecificoPrograma
      };
      this.DatosEnvioFormulario.IdCampania = parseInt(idcampania);
      this._HelperService.EnviarFormulario(
        this.DatosEnvioFormulario).pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            this.ProcesarAsignacionAutomaticaNuevoPortal(x.id)
            this.cleanSub=false;
            this.datos.nombres = this.DatosEnvioFormulario.Nombres;
            this.datos.apellidos = this.DatosEnvioFormulario.Apellidos;
            this.datos.email = this.DatosEnvioFormulario.Correo1;
            this.datos.idPais = this.DatosEnvioFormulario.IdPais;
            this.datos.idRegion = this.DatosEnvioFormulario.IdRegion;
            this.datos.idLocalidad = value.IdLocalidad;
            this.datos.movil = this.DatosEnvioFormulario.Movil;
            var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
            if(DatosFormulario!=''){
              var datosPrevios = JSON.parse(DatosFormulario);
              this.datos.idCargo=datosPrevios.idCargo;
              this.datos.idAreaFormacion=datosPrevios.idAreaFormacion;
              this.datos.idAreaTrabajo=datosPrevios.idAreaTrabajo;
              this.datos.idIndustria=datosPrevios.idIndustria;
            }
            this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
            this.CompleteLocalStorage=true;
            if(this.isBrowser){
              fbq('trackSingle','269257245868695', 'Lead', {}, {eventID:x.id});
              this._FacebookPixelService.SendLoad(x.id,x.correoEnc,x.telEnc,x.userAgent,x.userIp).subscribe({
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
            this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
          },
          complete: () => {
            //this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
            this.statuscharge = false;
            this.obtenerFormularioCompletado();
          },
        });
    }
  }
  ProcesarAsignacionAutomaticaNuevoPortal(id:any){
    this._ChatEnLineaService.ProcesarAsignacionAutomaticaNuevoPortal(id).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
      }
    })
  }
  obtenerFormularioCompletado(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.formularioContacto.Nombres=datos.nombres;
      this.formularioContacto.Apellidos=datos.apellidos;
      this.formularioContacto.Email=datos.email;
      this.formularioContacto.IdPais=datos.idPais;
      this.formularioContacto.IdRegion=datos.idRegion;
      this.formularioContacto.Movil=datos.movil;
      this.formularioContacto.IdLocalidad=datos.idLocalidad;
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
      this.CompleteLocalStorage=true;
    }
    else{
      this.CompleteLocalStorage=false;
    }
  }
  ObtenerCombosPortal() {
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.listaLocalidades = x.listaLocalida.map((p:any)=>String(p.codigo));
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdPais') {
            r.data = x.listaPais.map((p: any) => {
              var ps: Basic = { Nombre: p.pais, value: p.idPais };
              return ps;
            });
            r.filteredOptions = r.data;
            r.filteredOptionsAux = r.data;
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdCargo') {
            r.data = x.listaCargo.map((p: any) => {
              var ps: Basic = { Nombre: p.cargo, value: p.idCargo };
              return ps;
            });
            r.filteredOptions = r.data;
            r.filteredOptionsAux = r.data;
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdAreaFormacion') {
            r.data = x.listaAreaFormacion.map((p: any) => {
              var ps: Basic = {
                Nombre: p.areaFormacion,
                value: p.idAreaFormacion,
              };
              return ps;
            });
            r.filteredOptions = r.data;
            r.filteredOptionsAux = r.data;
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdAreaTrabajo') {
            r.data = x.listaAreaTrabajo.map((p: any) => {
              var ps: Basic = { Nombre: p.areaTrabajo, value: p.idAreaTrabajo };
              return ps;
            });
            r.filteredOptions = r.data;
            r.filteredOptionsAux = r.data;
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdIndustria') {
            r.data = x.listaIndustria.map((p: any) => {
              var ps: Basic = { Nombre: p.industria, value: p.idIndustria };
              return ps;
            });
            r.filteredOptions = r.data;
            r.filteredOptionsAux = r.data;
          }
        });
      },
    });
    this.initValues = true;
  }
  GetRegionesPorPais(idPais: number) {
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdRegion') {
            r.disable = false;
            r.data = x.map((p: any) => {
              var ps: Basic = { Nombre: p.nombreCiudad, value: p.idCiudad };
              return ps;
            });
            r.filteredOptions = r.data;
            r.filteredOptionsAux = r.data;
          }
        });
        this.form.enablefield('IdRegion');
      },
    });
  }
  GetLocalidadesPorRegion(idRegion:number){
    this._RegionService.ObtenerLocalidadPorRegion(idRegion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if (x.length != 0 && x != undefined && x !=null ) {
          this.fileds.forEach(r=>{
            if(r.nombre=='IdLocalidad'){
              r.disable=false;
              r.hidden=false;
              r.data = x.map((p:any)=>{
                var ps:Basic={Nombre:p.nombreLocalidad,value:p.codigo,longitudCelular:p.longitudCelular};
                return ps;
              })
              r.filteredOptions = r.data;
              r.filteredOptionsAux = r.data;
            }
          })
          this.form.enablefield('IdLocalidad');
        }
        else{
          this.fileds.forEach(r=>{
            if(r.nombre=='IdLocalidad'){
              r.disable=true;
              r.hidden=true;
              r.validate=[];
            }
          })

        }
      }
    })
  }
  AddFields() {
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
      nombre: 'Email',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required, Validators.email],
      label: 'E-mail',
    });
    this.fileds.push({
      nombre: 'IdPais',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'País',
    });
    this.fileds.push({
      nombre: 'IdRegion',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      disable: true,
      label: 'Región',
    });
    this.fileds.push({
      nombre: 'IdLocalidad',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      disable: true,
      hidden:true,
      label: 'Localidad',
    });
    this.fileds.push({
      nombre: 'Movil',
      tipo: 'phone',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Teléfono Móvil',
    });
    this.fileds.push({
      nombre: 'terminos',
      tipo: 'terminos',
      valorInicial: '',
      validate: [Validators.required,Validators.requiredTrue],
      label: 'terminos',
      style:'font-size: 12px;margin-bottom: 20px;'
    });

  }
  LimpiarCampos(){
    this.CompleteLocalStorage=false;
    this._SessionStorageService.SessionDeleteValue('DatosFormulario');
    this.combosPrevios=undefined;
    this.formularioContacto.Nombres= '',
    this.formularioContacto.Apellidos= '',
    this.formularioContacto.Email= '',
    this.formularioContacto.IdPais=undefined,
    this.formularioContacto.IdRegion=undefined,
    this.formularioContacto.Movil= '',
    this.GetRegionesPorPais(-1);
  }
  SelectChage(e: any) {
    if (e.Nombre == 'IdPais') {
      if(e.value!=52){
        this.fileds.filter(x=>x.nombre=='IdLocalidad')[0].hidden=true;
        this.fileds.filter(x=>x.nombre=='IdLocalidad')[0].valorInicial = '';
      }
      this.GetRegionesPorPais(e.value);
    }
    if (e.Nombre == 'IdRegion') {
      this.GetLocalidadesPorRegion(e.value)
    }
  }
}
