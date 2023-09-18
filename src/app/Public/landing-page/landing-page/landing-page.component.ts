import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { combosPerfilDTO } from 'src/app/Core/Models/AlumnoDTO';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioLandingPageDTO } from 'src/app/Core/Models/FormularioDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { LandingPageService } from 'src/app/Core/Shared/Services/LandingPage/landing-page.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { LandingPageInterceptorComponent } from './landing-page-interceptor/landing-page-interceptor/landing-page-interceptor.component';
import { ChatEnLineaService } from 'src/app/Core/Shared/Services/ChatEnLinea/chat-en-linea.service';
import { FacebookPixelService } from 'src/app/Core/Shared/Services/FacebookPixel/facebook-pixel.service';
declare const fbq: any;
declare const gtag: any;
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  isBrowser: boolean;
  constructor(
    private router: Router,

    private _DatosPortalService: DatosPortalService,
    private _RegionService: RegionService,
    private _LandingPageService: LandingPageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _SessionStorageService: SessionStorageService,
    private _ChatEnLineaService:ChatEnLineaService,

    private _FacebookPixelService:FacebookPixelService,
    public dialogRef: MatDialogRef<LandingPageInterceptorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public IdFormulario = 0;
  public obj: any;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  // public FormularioLandingPage:FormularioLandingPageDTO={
  //   Nombres:'',
  //   Apellidos:'',
  //   Email:'',
  //   IdPais:undefined,
  //   IdRegion:undefined,
  //   Movil:'',
  //   IdCargo:undefined,
  //   IdAreaFormacion:undefined,
  //   IdAreaTrabajo:undefined,
  //   IdIndustria:undefined,
  // }
  public DatosLandingPageEnvio: ContactenosDTO = {
    NombrePrograma: '',
    IdFormularioPublicidad: 0,
    IdCategoriaDato: 0,
    IdCampania: 0,
    IdTipoDato: 0,
    IdFaseOportunidad: 0,
    NombreFormulario: '',
    NombreOrigen: '',
    IdCentroCosto: 0,
    Nombres: '',
    Apellidos: '',
    Correo1: '',
    IdPais: undefined,
    IdRegion: undefined,
    Movil: '',
    IdCargo: undefined,
    IdAreaFormacion: undefined,
    IdAreaTrabajo: undefined,
    IdIndustria: undefined,
  };
  public combosPrevios: any;
  public CompleteLocalStorage = false;
  public datos: DatosFormularioDTO = {
    nombres: '',
    apellidos: '',
    email: '',
    idPais: undefined,
    idRegion: undefined,
    movil: '',
    idCargo: undefined,
    idAreaFormacion: undefined,
    idAreaTrabajo: undefined,
    idIndustria: undefined,
  };
  ngOnInit(): void {
    console.log(this.data);
    var obj: any = {};
    this.data.CampoContacto.forEach((cc: any) => {
      obj[cc.identificadorApi] = '';
    });
    this.obj = obj;

    console.log(this.obj);
    this.obtenerFormularioCompletado();
    // this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
    //   this.combosPrevios=x.datosAlumno;
    //   this.FormularioLandingPage.Nombres= this.combosPrevios.nombres,
    //   this.FormularioLandingPage.Apellidos= this.combosPrevios.apellidos,
    //   this.FormularioLandingPage.Email= this.combosPrevios.email,
    //   this.FormularioLandingPage.IdPais= this.combosPrevios.idPais,
    //   this.FormularioLandingPage.IdRegion= this.combosPrevios.idDepartamento,
    //   this.FormularioLandingPage.Movil= this.combosPrevios.telefono,
    //   this.FormularioLandingPage.IdCargo= this.combosPrevios.idCargo,
    //   this.FormularioLandingPage.IdAreaTrabajo= this.combosPrevios.idAreaTrabajo,
    //   this.FormularioLandingPage.IdAreaFormacion= this.combosPrevios.idAreaFormacion,
    //   this.FormularioLandingPage.IdIndustria= this.combosPrevios.idIndustria
    //   if(this.FormularioLandingPage.IdPais!=undefined){
    //     this.GetRegionesPorPais(this.FormularioLandingPage.IdPais);
    //   }
    //   this.CompleteLocalStorage=false;
    // })

    this.AddFields();
    this.ObtenerCombosPortal();
  }
  obtenerFormularioCompletado() {
    var DatosFormulario =
      this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario);
    if (DatosFormulario != '') {
      var datos = JSON.parse(DatosFormulario);
      console.log(datos);
      this.combosPrevios = datos;
      if (this.obj.Nombres != undefined) {
        this.obj.Nombres = this.combosPrevios.nombres;
      }
      if (this.obj.Apellidos != undefined) {
        this.obj.Apellidos = this.combosPrevios.apellidos;
      }
      if (this.obj.Email != undefined) {
        this.obj.Email = this.combosPrevios.email;
      }
      if (this.obj.IdPais != undefined) {
        this.obj.IdPais = this.combosPrevios.idPais;
        this.GetRegionesPorPais(this.obj.IdPais);
      }
      if (this.obj.IdRegion != undefined) {
        this.obj.IdRegion = this.combosPrevios.idRegion;
      }
      if (this.obj.Movil != undefined) {
        this.obj.Movil = this.combosPrevios.movil;
      }
      if (this.obj.IdCargo != undefined) {
        this.obj.IdCargo = this.combosPrevios.idCargo;
      }
      if (this.obj.IdAreaTrabajo != undefined) {
        this.obj.IdAreaTrabajo = this.combosPrevios.idAreaTrabajo;
      }
      if (this.obj.IdAreaFormacion != undefined) {
        this.obj.IdAreaFormacion = this.combosPrevios.idAreaFormacion;
      }
      if (this.obj.IdIndustria != undefined) {
        this.obj.IdIndustria = this.combosPrevios.idIndustria;
      }
    } else {
      this.CompleteLocalStorage = false;
    }
  }
  LimpiarCampos() {
    this.CompleteLocalStorage = false;
    this._SessionStorageService.SessionDeleteValue('DatosFormulario');
    this.combosPrevios = undefined;
    if (this.obj.Apellidos != undefined) {
      this.obj.Nombres = '';
    }
    if (this.obj.Apellidos != undefined) {
      this.obj.Apellidos = '';
    }
    if (this.obj.Email != undefined) {
      this.obj.Email = '';
    }
    if (this.obj.IdPais != undefined) {
      this.obj.IdPais = undefined;
    }
    if (this.obj.IdRegion != undefined) {
      this.obj.IdRegion = undefined;
    }
    if (this.obj.Movil != undefined) {
      this.obj.Movil = '';
    }
    if (this.obj.IdCargo != undefined) {
      this.obj.IdCargo = undefined;
    }
    if (this.obj.IdAreaTrabajo != undefined) {
      this.obj.IdAreaTrabajo = undefined;
    }
    if (this.obj.IdAreaFormacion != undefined) {
      this.obj.IdAreaFormacion = undefined;
    }
    if (this.obj.idIndustria != undefined) {
      this.obj.IdIndustria = undefined;
    }
    this.GetRegionesPorPais(-1);
  }
  EnviarFormulario(value: any) {
    if (this.formVal) {
      this.initValues = false;
      this.statuscharge = true;
      this.DatosLandingPageEnvio.NombrePrograma = this.data.NombrePrograma;
      this.DatosLandingPageEnvio.IdFormularioPublicidad =
        this.data.IdFormulario;
      this.DatosLandingPageEnvio.IdCategoriaDato = this.data.IdCategoriaOrigen;
      this.DatosLandingPageEnvio.IdCampania = this.data.IdConjuntoAnuncio;
      this.DatosLandingPageEnvio.IdCentroCosto = this.data.IdCentroCosto;
      this.DatosLandingPageEnvio.IdTipoDato = 8;
      this.DatosLandingPageEnvio.IdFaseOportunidad = 2;
      this.DatosLandingPageEnvio.NombreFormulario = 'publicidad';
      if (this.DatosLandingPageEnvio.IdCategoriaDato == 104) {
        this.DatosLandingPageEnvio.NombreOrigen =
          'Adwords Busqueda Formulario Propio';
      } else {
        this.DatosLandingPageEnvio.NombreOrigen =
          'Mailing Bases Propias Formulario Propio';
      }
      this.DatosLandingPageEnvio.Nombres = value.Nombres;
      this.DatosLandingPageEnvio.Apellidos = value.Apellidos;
      this.DatosLandingPageEnvio.Correo1 = value.Email;
      this.DatosLandingPageEnvio.IdPais = value.IdPais;
      this.DatosLandingPageEnvio.IdRegion = value.IdRegion;
      this.DatosLandingPageEnvio.Movil = value.Movil;
      this.DatosLandingPageEnvio.IdCargo = value.IdCargo;
      this.DatosLandingPageEnvio.IdAreaFormacion = value.IdAreaFormacion;
      this.DatosLandingPageEnvio.IdAreaTrabajo = value.IdAreaTrabajo;
      this.DatosLandingPageEnvio.IdIndustria = value.IdIndustria;
      this._LandingPageService
        .EnviarFormularioLandingPage(this.DatosLandingPageEnvio)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            this.ProcesarAsignacionAutomaticaNuevoPortal(x);
            this.datos.nombres = this.DatosLandingPageEnvio.Nombres;
            this.datos.apellidos = this.DatosLandingPageEnvio.Apellidos;
            this.datos.email = this.DatosLandingPageEnvio.Correo1;
            this.datos.idPais = this.DatosLandingPageEnvio.IdPais;
            this.datos.idRegion = this.DatosLandingPageEnvio.IdRegion;
            this.datos.movil = this.DatosLandingPageEnvio.Movil;
            this.datos.idCargo = this.DatosLandingPageEnvio.IdCargo;
            this.datos.idAreaFormacion =
              this.DatosLandingPageEnvio.IdAreaFormacion;
            this.datos.idAreaTrabajo = this.DatosLandingPageEnvio.IdAreaTrabajo;
            this.datos.idIndustria = this.DatosLandingPageEnvio.IdIndustria;
            this._SessionStorageService.SessionSetValue(
              'DatosFormulario',
              JSON.stringify(this.datos)
            );
            this.CompleteLocalStorage = true;
            if (this.isBrowser) {
              fbq('trackSingle','269257245868695', 'Lead', {}, {eventID:x.id});
              this._FacebookPixelService.SendLoad(x.id,x.correoEnc,x.telEnc,x.userAgent,x.userIp).subscribe({
                next:(x)=>{
                  console.log(x)
                },
                error:(e)=>{
                  console.log(e)
                }
              });
              try {
                gtag('event', 'conversion', {
                  send_to: 'AW-991002043/tnStCPDl6HUQu_vF2AM',
                });
                gtag('event', 'conversion', {
                  send_to: 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
                });
              } catch (err) {}
            }
            this.dialogRef.close();
          },
          complete: () => {
            this.statuscharge = false;
            this.obtenerFormularioCompletado();
          },
        });
    } else {
      this._SnackBarServiceService.openSnackBar(
        'Debes completar todos los campos',
        'x',
        15,
        'snackbarCrucigramaerror'
      );
    }
  }
  ObtenerCombosPortal() {
    this._DatosPortalService
      .ObtenerCombosPortal()
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.fileds.forEach((r) => {
            if (r.nombre == 'IdPais') {
              r.data = x.listaPais.map((p: any) => {
                var ps: Basic = { Nombre: p.pais, value: p.idPais };
                return ps;
              });
            }
          });
          this.fileds.forEach((r) => {
            if (r.nombre == 'IdCargo') {
              r.data = x.listaCargo.map((p: any) => {
                var ps: Basic = { Nombre: p.cargo, value: p.idCargo };
                return ps;
              });
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
            }
          });
          this.fileds.forEach((r) => {
            if (r.nombre == 'IdAreaTrabajo') {
              r.data = x.listaAreaTrabajo.map((p: any) => {
                var ps: Basic = {
                  Nombre: p.areaTrabajo,
                  value: p.idAreaTrabajo,
                };
                return ps;
              });
            }
          });
          this.fileds.forEach((r) => {
            if (r.nombre == 'IdIndustria') {
              r.data = x.listaIndustria.map((p: any) => {
                var ps: Basic = { Nombre: p.industria, value: p.idIndustria };
                return ps;
              });
            }
          });
        },
      });
    this.initValues = true;
  }
  GetRegionesPorPais(idPais: number) {
    this._RegionService
      .ObtenerCiudadesPorPais(idPais)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.fileds.forEach((r) => {
            if (r.nombre == 'IdRegion') {
              r.disable = false;
              r.data = x.map((p: any) => {
                var ps: Basic = { Nombre: p.nombreCiudad, value: p.idCiudad };
                return ps;
              });
            }
          });
          this.form.enablefield('IdRegion');
        },
      });
  }
  ProcesarAsignacionAutomaticaNuevoPortal(data:any){
    this._ChatEnLineaService.ProcesarAsignacionAutomaticaNuevoPortal(data.id).subscribe({
      next:(x)=>{
      },
      complete: () => {
        //this.statuscharge=false;
      }
    })
  }
  SelectChage(e: any) {
    if (e.Nombre == 'IdPais') {
      this.GetRegionesPorPais(e.value);
    }
  }
  AddFields() {
    this.data.CampoContacto.forEach((cc: any) => {
      var val = [Validators.required];
      if (cc.identificadorApi == 'Email') {
        val.push(Validators.email);
      }
      this.fileds.push({
        nombre: cc.identificadorApi,
        tipo: cc.tipoControl,
        valorInicial: '',
        validate: val,
        label: cc.nombreLabel,
      });
    });

    // this.fileds.push({
    //   nombre:"Nombres",
    //   tipo:"text",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Nombres",
    // });
    // this.fileds.push({
    //   nombre:"Apellidos",
    //   tipo:"text",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Apellidos",

    // });
    // this.fileds.push({
    //   nombre:"Email",
    //   tipo:"text",
    //   valorInicial:"",
    //   validate:[Validators.required,Validators.email],
    //   label:"E-mail",

    // });
    // this.fileds.push({
    //   nombre:"IdPais",
    //   tipo:"select",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"País",
    // });
    // this.fileds.push({
    //   nombre:"IdRegion",
    //   tipo:"select",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   disable:true,
    //   label:"Región",
    // });
    // this.fileds.push({
    //   nombre:"Movil",
    //   tipo:"phone",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Teléfono Móvil",
    // });
    // this.fileds.push({
    //   nombre:"IdCargo",
    //   tipo:"select",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Cargo",
    // });
    // this.fileds.push({
    //   nombre:"IdAreaFormacion",
    //   tipo:"select",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Área de Formación",
    // });
    // this.fileds.push({
    //   nombre:"IdAreaTrabajo",
    //   tipo:"select",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Área de Trabajo",
    // });
    // this.fileds.push({
    //   nombre:"IdIndustria",
    //   tipo:"select",
    //   valorInicial:"",
    //   validate:[Validators.required],
    //   label:"Industria",
    // });
  }
}
