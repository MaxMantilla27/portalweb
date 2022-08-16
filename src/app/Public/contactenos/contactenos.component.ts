import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO } from 'src/app/Core/Models/FormularioDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { ContactenosService } from 'src/app/Core/Shared/Services/Contactenos/contactenos.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
declare const fbq:any;

declare const gtag:any;
@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.scss']
})
export class ContactenosComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  isBrowser: boolean;
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private _DatosPortalService:DatosPortalService,
    private _RegionService:RegionService,
    private _ContactenosService:ContactenosService,
    private _HelperService: HelperService,
    private _SeoService:SeoService,
    @Inject(PLATFORM_ID) platformId: Object,
    private _SessionStorageService:SessionStorageService,
    private _SnackBarServiceService:SnackBarServiceService,
    private title:Title

    ) {
      this.isBrowser = isPlatformBrowser(platformId);
    }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Contáctanos',
      urlWeb: '/contactenos'
    }
  ]
  public expancion=[false,false,false,false,false]
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoDTO={
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
    Comentario:''
  }
  public DatosContactenosEnvio: ContactenosDTO={
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
    Comentario:'',
  }
  public combosPrevios:any
  ngOnInit(): void {


    let t:string='BSG Institute - Contáctenos'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      title:'BSG Institute - Contáctenos',
      slug:'contactenos',
      description:'Programas, Certificaciones y Cursos en Big Data, Analytics, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 27001, Construcción, Minería.',
      keywords:'BSG Institute,curso de excel avanzado, curso autocad, curso de excel basico, especializacion en gerencia de proyectos, certificacion itil, especializacion en salud ocupacional, curso ms project,curso revit',
      ogDescription:'Programas, Certificaciones y Cursos en Big Data, Analytics, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 27001, Construcción, Minería.',
      twiterDescription:'Programas, Certificaciones y Cursos en Big Data, Analytics, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 27001, Construcción, Minería.'
    });


    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.combosPrevios=x.datosAlumno;
      this.formularioContacto.Nombres= this.combosPrevios.nombres,
      this.formularioContacto.Apellidos= this.combosPrevios.apellidos,
      this.formularioContacto.Email= this.combosPrevios.email,
      this.formularioContacto.IdPais= this.combosPrevios.idPais,
      this.formularioContacto.IdRegion= this.combosPrevios.idDepartamento,
      this.formularioContacto.Movil= this.combosPrevios.telefono,
      this.formularioContacto.IdCargo= this.combosPrevios.idCargo,
      this.formularioContacto.IdAreaTrabajo= this.combosPrevios.idAreaTrabajo,
      this.formularioContacto.IdAreaFormacion= this.combosPrevios.idAreaFormacion,
      this.formularioContacto.IdIndustria= this.combosPrevios.idIndustria
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
    })
    this.AddFields();
    this.ObtenerCombosPortal();
  }
  SetContacto(value:any){
    if(this.formVal){
      this.initValues = false;
      this.DatosContactenosEnvio.Nombres=value.Nombres;
      this.DatosContactenosEnvio.Apellidos=value.Apellidos;
      this.DatosContactenosEnvio.Correo1=value.Email;
      this.DatosContactenosEnvio.IdPais=value.IdPais;
      this.DatosContactenosEnvio.IdRegion=value.IdRegion;
      this.DatosContactenosEnvio.Movil=value.Movil;
      this.DatosContactenosEnvio.IdCargo=value.IdCargo;
      this.DatosContactenosEnvio.IdAreaFormacion=value.IdAreaFormacion;
      this.DatosContactenosEnvio.IdAreaTrabajo=value.IdAreaTrabajo;
      this.DatosContactenosEnvio.IdIndustria=value.IdIndustria;
      this.DatosContactenosEnvio.Comentario=value.Comentario;
      var IdPespecifico=this._SessionStorageService.SessionGetValueCokies("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueCokies("idCategoria");
      this.DatosContactenosEnvio.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);
      if(IdPespecifico==''){
        this.DatosContactenosEnvio.IdPespecifico=0
      }else{
        this.DatosContactenosEnvio.IdPespecifico=parseInt(IdPespecifico)
      };
      console.log(this.DatosContactenosEnvio)
      this._ContactenosService.EnviarFormulario(this.DatosContactenosEnvio).subscribe({
        next:x => {
          console.log(x);

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
          this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
        },
        // error:(e)=>{

        //   console.log(e);
        //   console.log('------------------facebook(false)---------------------------');
        //   console.log(fbq);
        //   fbq('track', 'CompleteRegistration');
        // },
        complete: () => {
          console.log('------------------facebook(complete)---------------------------');
          this.statuscharge = false;
        },
      });
    }
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x);
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
    this.fileds.push({
      nombre:"Comentario",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Comentario",
    });
  }
  LimpiarCampos(){
    this.combosPrevios=undefined;
    this.formularioContacto.Nombres= '',
    this.formularioContacto.Apellidos= '',
    this.formularioContacto.Email= '',
    this.formularioContacto.IdPais= undefined,
    this.formularioContacto.IdRegion= undefined,
    this.formularioContacto.Movil= '',
    this.formularioContacto.IdCargo= undefined,
    this.formularioContacto.IdAreaTrabajo= undefined,
    this.formularioContacto.IdAreaFormacion= undefined,
    this.formularioContacto.IdIndustria= undefined,
    this.GetRegionesPorPais(-1);
  }
}

