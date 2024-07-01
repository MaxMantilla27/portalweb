import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioPublicidadDTO } from 'src/app/Core/Models/FormularioDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { ChatEnLineaService } from 'src/app/Core/Shared/Services/ChatEnLinea/chat-en-linea.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { LandingPageService } from 'src/app/Core/Shared/Services/LandingPage/landing-page.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { FormularioPublicidadInterceptorComponent } from './FormularioPublicidadInterceptor/formulario-publicidad-interceptor.component';
import { FacebookPixelService } from 'src/app/Core/Shared/Services/FacebookPixel/facebook-pixel.service';
declare const fbq:any;
declare const gtag:any;
@Component({
  selector: 'app-formulario-publicidad',
  templateUrl: './formulario-publicidad.component.html',
  styleUrls: ['./formulario-publicidad.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class FormularioPublicidadComponent implements OnInit {
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
    private _SessionStorageService:SessionStorageService,
    private _ChatEnLineaService:ChatEnLineaService,

    private _FacebookPixelService:FacebookPixelService,
    public dialogRef: MatDialogRef<FormularioPublicidadInterceptorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }

  public IdFormulario=0;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public FormularioPublicidad:FormularioPublicidadDTO={
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
  public combosPrevios:any;
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
    this.obtenerFormularioCompletado();
    // this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
    //   this.combosPrevios=x.datosAlumno;
    //   console.log(this.combosPrevios)
    //   this.FormularioPublicidad.Nombres= this.combosPrevios.nombres,
    //   this.FormularioPublicidad.Apellidos= this.combosPrevios.apellidos,
    //   this.FormularioPublicidad.Email= this.combosPrevios.email,
    //   this.FormularioPublicidad.IdPais= this.combosPrevios.idPais,
    //   this.FormularioPublicidad.IdRegion= this.combosPrevios.idDepartamento,
    //   this.FormularioPublicidad.Movil= this.combosPrevios.telefono,
    //   this.FormularioPublicidad.IdCargo= this.combosPrevios.idCargo,
    //   this.FormularioPublicidad.IdAreaTrabajo= this.combosPrevios.idAreaTrabajo,
    //   this.FormularioPublicidad.IdAreaFormacion= this.combosPrevios.idAreaFormacion,
    //   this.FormularioPublicidad.IdIndustria= this.combosPrevios.idIndustria
    //   if(this.FormularioPublicidad.IdPais!=undefined){
    //     this.GetRegionesPorPais(this.FormularioPublicidad.IdPais);
    //   }
    //   this.CompleteLocalStorage=false;
    // })
    this.ObtenerCombosPortal();

    this.AddFields();
  }
  obtenerFormularioCompletado(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.FormularioPublicidad.Nombres=datos.nombres;
      this.FormularioPublicidad.Apellidos=datos.apellidos;
      this.FormularioPublicidad.Email=datos.email;
      this.FormularioPublicidad.IdPais=datos.idPais;
      this.FormularioPublicidad.IdRegion=datos.idRegion;
      this.FormularioPublicidad.Movil=datos.movil;
      this.FormularioPublicidad.IdCargo=datos.idCargo;
      this.FormularioPublicidad.IdAreaFormacion=datos.idAreaFormacion;
      this.FormularioPublicidad.IdAreaTrabajo=datos.idAreaTrabajo;
      this.FormularioPublicidad.IdIndustria=datos.idIndustria;
      if(this.FormularioPublicidad.IdPais!=undefined){
        this.GetRegionesPorPais(this.FormularioPublicidad.IdPais);
      }
      this.CompleteLocalStorage=true;
    }
    else{
      this.CompleteLocalStorage=false;
    }
  }
  EnviarFormularioPublicidad(value:any){
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
    this.DatosLandingPageEnvio.NombreOrigen='Adwords Busqueda Formulario Propio';
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
        this.ProcesarAsignacionAutomaticaNuevoPortal(x.id);
        this.datos.nombres = this.DatosLandingPageEnvio.Nombres;
        this.datos.apellidos = this.DatosLandingPageEnvio.Apellidos;
        this.datos.email = this.DatosLandingPageEnvio.Correo1;
        this.datos.idPais = this.DatosLandingPageEnvio.IdPais;
        this.datos.idRegion = this.DatosLandingPageEnvio.IdRegion;
        this.datos.movil = this.DatosLandingPageEnvio.Movil;
        this.datos.idCargo = this.DatosLandingPageEnvio.IdCargo;
        this.datos.idAreaFormacion = this.DatosLandingPageEnvio.IdAreaFormacion;
        this.datos.idAreaTrabajo = this.DatosLandingPageEnvio.IdAreaTrabajo;
        this.datos.idIndustria = this.DatosLandingPageEnvio.IdIndustria
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

          try{
            gtag('event', 'conversion', {
              'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
            });
            gtag('event', 'conversion', {
                'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
            });
            gtag('event', 'conversion', {
              'send_to': 'AW-11065656821/6CM8CNWQ2IcYEPWLwpwp',
            });
            gtag('event', 'conversion', {
              'send_to': 'AW-16616211963/fM6YCPT-2bsZEPuLnfM9',
            });
          }catch(err){
          }
        }
        this.dialogRef.close()
      },
      complete: () => {
        //this.statuscharge = false;
        this.obtenerFormularioCompletado();
      },
    });
  }

  ProcesarAsignacionAutomaticaNuevoPortal(id:string){
    this._ChatEnLineaService.ProcesarAsignacionAutomaticaNuevoPortal(id).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x)
        this.dialogRef.close()
      }
    })
  }
  LimpiarCampos(){
    this.CompleteLocalStorage=false;
    this._SessionStorageService.SessionDeleteValue('DatosFormulario');
    this.combosPrevios=undefined;
    this.FormularioPublicidad.Nombres= '',
    this.FormularioPublicidad.Apellidos= '',
    this.FormularioPublicidad.Email= '',
    this.FormularioPublicidad.IdPais= undefined,
    this.FormularioPublicidad.IdRegion= undefined,
    this.FormularioPublicidad.Movil= '',
    this.FormularioPublicidad.IdCargo= undefined,
    this.FormularioPublicidad.IdAreaTrabajo= undefined,
    this.FormularioPublicidad.IdAreaFormacion= undefined,
    this.FormularioPublicidad.IdIndustria= undefined,
    this.GetRegionesPorPais(-1);

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
            r.filteredOptions = r.data;
            r.filteredOptionsAux =r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdCargo'){
            r.data=x.listaCargo.map((p:any)=>{
              var ps:Basic={Nombre:p.cargo,value:p.idCargo};
              return ps;
            })
            r.filteredOptions = r.data;
            r.filteredOptionsAux =r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaFormacion'){
            r.data=x.listaAreaFormacion.map((p:any)=>{
              var ps:Basic={Nombre:p.areaFormacion,value:p.idAreaFormacion};
              return ps;
            })
            r.filteredOptions = r.data;
            r.filteredOptionsAux =r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaTrabajo'){
            r.data=x.listaAreaTrabajo.map((p:any)=>{
              var ps:Basic={Nombre:p.areaTrabajo,value:p.idAreaTrabajo};
              return ps;
            })
            r.filteredOptions = r.data;
            r.filteredOptionsAux =r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdIndustria'){
            r.data=x.listaIndustria.map((p:any)=>{
              var ps:Basic={Nombre:p.industria,value:p.idIndustria};
              return ps;
            })
            r.filteredOptions = r.data;
            r.filteredOptionsAux =r.data;
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
            r.filteredOptions = r.data;
            r.filteredOptionsAux =r.data;
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
      nombre:"IdAreaFormacion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área de Formación",
    });
    this.fileds.push({
      nombre:"IdCargo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Cargo",
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
    this.fileds.push({
      nombre:"Email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"E-mail",

    });
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
  }
}
