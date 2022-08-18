import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { LandingPageService } from 'src/app/Core/Shared/Services/LandingPage/landing-page.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { LandingPageInterceptorComponent } from './landing-page-interceptor/landing-page-interceptor/landing-page-interceptor.component';
declare const fbq:any;
declare const gtag:any;
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class LandingPageComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  isBrowser: boolean;
  constructor(
    private router: Router,

    private _DatosPortalService:DatosPortalService,
    private _RegionService:RegionService,
    private _LandingPageService:LandingPageService,
    private _HelperService: HelperService,

    public dialogRef: MatDialogRef<LandingPageInterceptorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public IdFormulario=0;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public FormularioLandingPage:FormularioLandingPageDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
    IdCargo:undefined,
    IdAreaFormacion:undefined,
    IdAreaTrabajo:undefined,
    IdIndustria:undefined,
  }
  public DatosLandingPageEnvio: ContactenosDTO={
    NombrePrograma:'',
    IdFormularioPublicidad:0,
    IdCategoriaDato:0,
    IdCampania:0,
    IdTipoDato:0,
    IdFaseOportunidad:0,
    NombreFormulario:'',
    NombreOrigen:'',
    IdCentroCosto:0,
    Nombres:'',
    Apellidos:'',
    Correo1:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
    IdCargo:undefined,
    IdAreaFormacion:undefined,
    IdAreaTrabajo:undefined,
    IdIndustria:undefined,
  }
  public combosPrevios:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.combosPrevios=x.datosAlumno;
      this.FormularioLandingPage.Nombres= this.combosPrevios.nombres,
      this.FormularioLandingPage.Apellidos= this.combosPrevios.apellidos,
      this.FormularioLandingPage.Email= this.combosPrevios.email,
      this.FormularioLandingPage.IdPais= this.combosPrevios.idPais,
      this.FormularioLandingPage.IdRegion= this.combosPrevios.idDepartamento,
      this.FormularioLandingPage.Movil= this.combosPrevios.telefono,
      this.FormularioLandingPage.IdCargo= this.combosPrevios.idCargo,
      this.FormularioLandingPage.IdAreaTrabajo= this.combosPrevios.idAreaTrabajo,
      this.FormularioLandingPage.IdAreaFormacion= this.combosPrevios.idAreaFormacion,
      this.FormularioLandingPage.IdIndustria= this.combosPrevios.idIndustria
      if(this.FormularioLandingPage.IdPais!=undefined){
        this.GetRegionesPorPais(this.FormularioLandingPage.IdPais);
      }
    })
    this.AddFields();
    this.ObtenerCombosPortal();
  }
  LimpiarCampos(){
    this.combosPrevios=undefined;
    this.FormularioLandingPage.Nombres= '',
      this.FormularioLandingPage.Apellidos= '',
      this.FormularioLandingPage.Email= '',
      this.FormularioLandingPage.IdPais= undefined,
      this.FormularioLandingPage.IdRegion= undefined,
      this.FormularioLandingPage.Movil= '',
      this.FormularioLandingPage.IdCargo= undefined,
      this.FormularioLandingPage.IdAreaTrabajo= undefined,
      this.FormularioLandingPage.IdAreaFormacion= undefined,
      this.FormularioLandingPage.IdIndustria= undefined,
      this.GetRegionesPorPais(-1);

  }
  EnviarFormulario(value:any){
    this.initValues = false;

    this.statuscharge=true;
    this.DatosLandingPageEnvio.NombrePrograma= this.data.NombrePrograma;
    this.DatosLandingPageEnvio.IdFormularioPublicidad= this.data.IdFormulario;
    this.DatosLandingPageEnvio.IdCategoriaDato= this.data.IdCategoriaOrigen;
    this.DatosLandingPageEnvio.IdCampania= this.data.IdConjuntoAnuncio;
    this.DatosLandingPageEnvio.IdCentroCosto= this.data.IdCentroCosto;
    this.DatosLandingPageEnvio.IdTipoDato= 8;
    this.DatosLandingPageEnvio.IdFaseOportunidad=2;
    this.DatosLandingPageEnvio.NombreFormulario='publicidad';
    if(this.DatosLandingPageEnvio.IdCategoriaDato==104){
      this.DatosLandingPageEnvio.NombreOrigen='Adwords Busqueda Formulario Propio';
    }
    else{
    this.DatosLandingPageEnvio.NombreOrigen='Mailing Bases Propias Formulario Propio';
    }
    this.DatosLandingPageEnvio.Nombres=value.Nombres;
    this.DatosLandingPageEnvio.Apellidos=value.Apellidos;
    this.DatosLandingPageEnvio.Correo1=value.Email;
    this.DatosLandingPageEnvio.IdPais=value.IdPais;
    this.DatosLandingPageEnvio.IdRegion=value.IdRegion;
    this.DatosLandingPageEnvio.Movil=value.Movil;
    this.DatosLandingPageEnvio.IdCargo=value.IdCargo;
    this.DatosLandingPageEnvio.IdAreaFormacion=value.IdAreaFormacion;
    this.DatosLandingPageEnvio.IdAreaTrabajo=value.IdAreaTrabajo;
    this.DatosLandingPageEnvio.IdIndustria=value.IdIndustria;
    this._LandingPageService.EnviarFormularioLandingPage(this.DatosLandingPageEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        if(this.isBrowser){
          console.log('------------------facebook(true)---------------------------');
          console.log(fbq);

          fbq('track', 'CompleteRegistration');
          try{
            gtag('event', 'conversion', {
              'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
            });
            gtag('event', 'conversion', {
                'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
            });
          }catch(err){
            console.log(err)
          }
        }
        this.dialogRef.close()
      },
      complete: () => {
        this.statuscharge = false;
      },
    });
  }
  ObtenerCombosPortal(){

    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data=x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdCargo'){
            r.data=x.listaCargo.map((p:any)=>{
              var ps:Basic={Nombre:p.cargo,value:p.idCargo};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaFormacion'){
            r.data=x.listaAreaFormacion.map((p:any)=>{
              var ps:Basic={Nombre:p.areaFormacion,value:p.idAreaFormacion};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaTrabajo'){
            r.data=x.listaAreaTrabajo.map((p:any)=>{
              var ps:Basic={Nombre:p.areaTrabajo,value:p.idAreaTrabajo};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdIndustria'){
            r.data=x.listaIndustria.map((p:any)=>{
              var ps:Basic={Nombre:p.industria,value:p.idIndustria};
              return ps;
            })
          }
        })
      }
    })
    this.initValues = true;
  }
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
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
  SelectChage(e:any){
    if(e.Nombre=="IdPais"){
      this.GetRegionesPorPais(e.value)
    }
  }
  AddFields(){

    this.fileds.push({
      nombre:"Nombres",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Nombres",
    });
    this.fileds.push({
      nombre:"Apellidos",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Apellidos",

    });
    this.fileds.push({
      nombre:"Email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"E-mail",

    });
    this.fileds.push({
      nombre:"IdPais",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"País",
    });
    this.fileds.push({
      nombre:"IdRegion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      disable:true,
      label:"Región",
    });
    this.fileds.push({
      nombre:"Movil",
      tipo:"phone",
      valorInicial:"",
      validate:[Validators.required],
      label:"Teléfono Móvil",
    });
    this.fileds.push({
      nombre:"IdCargo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Cargo",
    });
    this.fileds.push({
      nombre:"IdAreaFormacion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área de Formación",
    });
    this.fileds.push({
      nombre:"IdAreaTrabajo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área de Trabajo",
    });
    this.fileds.push({
      nombre:"IdIndustria",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Industria",
    });
  }
}
