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
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioLandingPageDTO } from 'src/app/Core/Models/FormularioDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { ChatEnLineaService } from 'src/app/Core/Shared/Services/ChatEnLinea/chat-en-linea.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { LandingPageService } from 'src/app/Core/Shared/Services/LandingPage/landing-page.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { LandinPageV2Component } from '../landin-page-v2.component';
import { FacebookPixelService } from 'src/app/Core/Shared/Services/FacebookPixel/facebook-pixel.service';
declare const fbq: any;
declare const gtag: any;

@Component({
  selector: 'app-landing-page-modal',
  templateUrl: './landing-page-modal.component.html',
  styleUrls: ['./landing-page-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingPageModalComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  isBrowser: boolean;
  constructor(
    private router: Router,

    private _DatosPortalService: DatosPortalService,
    private _RegionService: RegionService,
    private _SessionStorageService: SessionStorageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _LandingPageService: LandingPageService,
    private _ChatEnLineaService: ChatEnLineaService,

    private _FacebookPixelService: FacebookPixelService,

    public dialogRef: MatDialogRef<LandinPageV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ngOnInit(): void {
    console.log(this.data);
    var obj: any = {};
    this.data.valorPrograma.campoContacto.forEach((cc: any) => {
      obj[cc.identificadorApi] = '';
    });
    this.obj = obj;
    this.obtenerFormularioCompletado();
    // this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
    //   console.log(x.datosAlumno)
    //   this.combosPrevios=x.datosAlumno;
    //   if(this.obj.Nombres!=undefined){
    //     this.obj.Nombres=this.combosPrevios.nombres
    //   }
    //   if(this.obj.Apellidos!=undefined){
    //     this.obj.Apellidos=this.combosPrevios.apellidos
    //     console.log(obj.Apellidos)
    //   }
    //   if(this.obj.Email!=undefined){
    //     this.obj.Email=this.combosPrevios.email
    //   }
    //   if(this.obj.IdPais!=undefined){
    //     this.obj.IdPais=this.combosPrevios.idPais
    //   }
    //   if(this.obj.IdRegion!=undefined){
    //     this.obj.IdRegion=this.combosPrevios.idDepartamento
    //   }
    //   if(this.obj.Movil!=undefined){
    //     this.obj.Movil=this.combosPrevios.telefono
    //   }
    //   if(this.obj.IdCargo!=undefined){
    //     this.obj.IdCargo=this.combosPrevios.idCargo
    //   }
    //   if(this.obj.IdAreaTrabajo!=undefined){
    //     this.obj.IdAreaTrabajo=this.combosPrevios.idAreaTrabajo
    //   }
    //   if(this.obj.IdAreaFormacion!=undefined){
    //     this.obj.IdAreaFormacion=this.combosPrevios.idAreaFormacion
    //   }
    //   if(this.obj.IdIndustria!=undefined){
    //     this.obj.IdIndustria=this.combosPrevios.idIndustria
    //   }
    //   console.log(this.obj)
    // })
    console.log(this.obj);
    this.AddFields();
    this.ObtenerCombosPortal();
    this.Secciones = JSON.parse(this.data.valorPrograma.estilosCongelados);
    console.log(this.Secciones);
    let i = 0;
    this.Secciones.forEach((x: any) => {
      this.cambios(i);
      i++;
    });
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
    }
  }
  public IdFormulario = 0;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];

  Cabecera: any;
  Titulo: any;
  Subitutlo: any;
  Input: any;
  Boton: any;
  Plantilla: any;
  fondoColor: any;

  Secciones = this.data.Secciones;
  public obj: any;

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

  EnviarFormulario(value: any) {
    console.log(value);
    if (this.formVal) {
      this.initValues = false;

      this.statuscharge = true;
      this.DatosLandingPageEnvio.NombrePrograma =
        this.data.valorPrograma.nombrePrograma;
      this.DatosLandingPageEnvio.IdFormularioPublicidad =
        this.data.valorPrograma.idFormulario;
      this.DatosLandingPageEnvio.IdCategoriaDato =
        this.data.valorPrograma.idCategoriaOrigen;
      this.DatosLandingPageEnvio.IdCampania =
        this.data.valorPrograma.idConjuntoAnuncio;
      this.DatosLandingPageEnvio.IdCentroCosto =
        this.data.valorPrograma.idCentroCosto;
      this.DatosLandingPageEnvio.IdTipoDato = 8;
      this.DatosLandingPageEnvio.IdFaseOportunidad = 2;
      this.DatosLandingPageEnvio.NombreFormulario = 'publicidad';
      if (this.DatosLandingPageEnvio.IdCategoriaDato == 104) {
        this.DatosLandingPageEnvio.NombreOrigen =
          'Adwords Busqueda Formulario Propio';
      } else if (this.DatosLandingPageEnvio.IdCategoriaDato == 624) {
        this.DatosLandingPageEnvio.NombreOrigen =
          'Masivos SMS Bases Propias Formulario Propio';
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
            this.ProcesarAsignacionAutomaticaNuevoPortal(x.id);
            if (x.body.oportuniodd == true) {
            }
            if (this.isBrowser) {
              fbq(
                'trackSingle',
                '269257245868695',
                'Lead',
                {},
                { eventID: x.id }
              );
              this._FacebookPixelService
                .SendLoad(x.id, x.correoEnc, x.telEnc, x.userAgent, x.userIp)
                .subscribe({
                  next: (x) => {
                    console.log(x);
                  },
                  error: (e) => {
                    console.log(e);
                  },
                });
              try {
                gtag('event', 'conversion', {
                  send_to: 'AW-991002043/tnStCPDl6HUQu_vF2AM',
                });
                gtag('event', 'conversion', {
                  send_to: 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
                });
                gtag('event', 'conversion', {
                  send_to: 'AW-11065656821/6CM8CNWQ2IcYEPWLwpwp',
                });
              } catch (err) {}
            }
          },

          complete: () => {
            //this.statuscharge = false;
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
  ProcesarAsignacionAutomaticaNuevoPortal(id: string) {
    this._ChatEnLineaService
      .ProcesarAsignacionAutomaticaNuevoPortal(id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.dialogRef.close();
        },
      });
  }
  submit(e: any) {
    console.log(e);
  }

  cambios(i: number) {
    var obj: any = {};
    this.Secciones[i].PSEstilo.forEach((v: any) => {
      obj[v.CodigoCss.toLowerCase()] = v.valor;
    });
    if (this.Secciones[i].NombreSeccion.toLowerCase() == 'cabecera') {
      this.Cabecera = obj;
      console.log(this.Cabecera);
    }
    if (this.Secciones[i].NombreSeccion.toLowerCase() == 'titulo') {
      this.Titulo = obj;
      console.log(this.Titulo);
    }
    if (this.Secciones[i].NombreSeccion.toLowerCase() == 'subtitulo') {
      this.Subitutlo = obj;
      console.log(this.Subitutlo);
    }
    if (this.Secciones[i].NombreSeccion.toLowerCase() == 'plantilla') {
      if (obj['background-fondo']) {
        console.log(obj);
        this.fondoColor = obj['background-fondo'];
        if (
          this.fondoColor != undefined &&
          this.fondoColor != null &&
          this.fondoColor.length > 0
        ) {
          console.log(this.fondoColor);
          this.fondoColor = this.fondoColor + '50';
        }
      }
      this.Plantilla = obj;
      console.log(this.fondoColor);
    }
    if (this.Secciones[i].NombreSeccion.toLowerCase() == 'boton') {
      this.Boton = obj;
      console.log(this.Boton);
    }

    if (this.Secciones[i].NombreSeccion.toLowerCase() == 'input') {
      this.Input = obj;
      console.log(this.Input);
    }
    console.log(this.Secciones);
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
  SelectChage(e: any) {
    if (e.Nombre == 'IdPais') {
      this.GetRegionesPorPais(e.value);
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
  AddFields() {
    this.data.valorPrograma.campoContacto.forEach((cc: any) => {
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
