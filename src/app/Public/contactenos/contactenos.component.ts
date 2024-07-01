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
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';
import { ChatEnLineaService } from 'src/app/Core/Shared/Services/ChatEnLinea/chat-en-linea.service';
import { FacebookPixelService } from 'src/app/Core/Shared/Services/FacebookPixel/facebook-pixel.service';
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
    private title:Title,
    private _FacebookPixelService:FacebookPixelService,
    private _ChatEnLineaService:ChatEnLineaService

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
    Comentario:'',
    IdLocalidad: undefined,
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
    idLocalidad: undefined,
  }
  public combosPrevios:any
  public cargando=false
  public cleanSub=false
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
    idLocalidad: undefined
  }
  public listaLocalidades?:any;
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
    this.obtenerFormularioCompletado();
    // this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
    //   this.combosPrevios=x.datosAlumno;
    //   this.formularioContacto.Nombres= this.combosPrevios.nombres,
    //   this.formularioContacto.Apellidos= this.combosPrevios.apellidos,
    //   this.formularioContacto.Email= this.combosPrevios.email,
    //   this.formularioContacto.IdPais= this.combosPrevios.idPais,
    //   this.formularioContacto.IdRegion= this.combosPrevios.idDepartamento,
    //   this.formularioContacto.Movil= this.combosPrevios.telefono,
    //   this.formularioContacto.IdCargo= this.combosPrevios.idCargo,
    //   this.formularioContacto.IdAreaTrabajo= this.combosPrevios.idAreaTrabajo,
    //   this.formularioContacto.IdAreaFormacion= this.combosPrevios.idAreaFormacion,
    //   this.formularioContacto.IdIndustria= this.combosPrevios.idIndustria
    //   if(this.formularioContacto.IdPais!=undefined){
    //     this.GetRegionesPorPais(this.formularioContacto.IdPais);
    //   }
    //   this.CompleteLocalStorage=false;
    // })
    this.AddFields();
    this.ObtenerCombosPortal();
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
      this.formularioContacto.IdCargo=datos.idCargo;
      this.formularioContacto.IdAreaFormacion=datos.idAreaFormacion;
      this.formularioContacto.IdAreaTrabajo=datos.idAreaTrabajo;
      this.formularioContacto.IdIndustria=datos.idIndustria;
      this.formularioContacto.IdLocalidad=datos.idLocalidad
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
      this.CompleteLocalStorage=true;
    }
    else{
      this.CompleteLocalStorage=false;
    }
  }
  SetContacto(value:any){
    if(this.formVal){
      this.cargando=true
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

      var IdPEspecifico=this._SessionStorageService.SessionGetValueCokies("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueCokies("idCategoria");
      var idcampania=this._SessionStorageService.SessionGetValueCokies("idCampania");

      this.DatosContactenosEnvio.IdPespecifico=IdPEspecifico==''?0:parseInt(IdPEspecifico);
      this.DatosContactenosEnvio.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);
      this.DatosContactenosEnvio.IdCampania=idcampania==''?0:parseInt(idcampania);

      console.log(this.DatosContactenosEnvio)
      this._ContactenosService.EnviarFormulario(this.DatosContactenosEnvio).subscribe({
        next:x => {
          this.ProcesarAsignacionAutomaticaNuevoPortal(x.id)
          this.cleanSub=false;
          this.datos.nombres = this.DatosContactenosEnvio.Nombres;
          this.datos.apellidos = this.DatosContactenosEnvio.Apellidos;
          this.datos.email = this.DatosContactenosEnvio.Correo1;
          this.datos.idPais = this.DatosContactenosEnvio.IdPais;
          this.datos.idRegion = this.DatosContactenosEnvio.IdRegion;
          this.datos.movil = this.DatosContactenosEnvio.Movil;
          this.datos.idCargo = this.DatosContactenosEnvio.IdCargo;
          this.datos.idAreaFormacion = this.DatosContactenosEnvio.IdAreaFormacion;
          this.datos.idLocalidad = value.IdLocalidad;
          this.datos.idAreaTrabajo = this.DatosContactenosEnvio.IdAreaTrabajo;
          this.datos.idIndustria = this.DatosContactenosEnvio.IdIndustria
          this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
          this.CompleteLocalStorage=true;
          this.formularioContacto.Comentario= '';
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
            gtag('event', 'conversion', {
              'send_to': 'AW-16616211963/fM6YCPT-2bsZEPuLnfM9',
            });
          }
          this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
        },
        complete: () => {
          console.log('------------------facebook(complete)---------------------------');
          this.statuscharge = false;
          this.cargando=false;
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
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x);
        this.listaLocalidades = x.listaLocalida.map((p:any)=>String(p.codigo));
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data =x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
            r.filteredOptionsAux = r.data;
            r.filteredOptions = r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdCargo'){
            r.data=x.listaCargo.map((p:any)=>{
              var ps:Basic={Nombre:p.cargo,value:p.idCargo};
              return ps;
            })
            r.filteredOptionsAux = r.data;
            r.filteredOptions = r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaFormacion'){
            r.data=x.listaAreaFormacion.map((p:any)=>{
              var ps:Basic={Nombre:p.areaFormacion,value:p.idAreaFormacion};
              return ps;
            })
            r.filteredOptionsAux = r.data;
            r.filteredOptions = r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaTrabajo'){
            r.data=x.listaAreaTrabajo.map((p:any)=>{
              var ps:Basic={Nombre:p.areaTrabajo,value:p.idAreaTrabajo};
              return ps;
            })
            r.filteredOptionsAux = r.data;
            r.filteredOptions = r.data;
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdIndustria'){
            r.data=x.listaIndustria.map((p:any)=>{
              var ps:Basic={Nombre:p.industria,value:p.idIndustria};
              return ps;
            })
            r.filteredOptionsAux = r.data;
            r.filteredOptions = r.data;
          }
        })
      }
    })
    this.initValues = true;
  }

  SelectChage(e:any){
    if(e.Nombre=="IdPais"){
      this.formularioContacto.IdRegion=undefined
      this.formularioContacto.IdLocalidad=undefined
      this.formularioContacto.Movil=''
      if(e.value!=52){
        this.fileds.filter(x=>x.nombre=='IdLocalidad')[0].hidden=true;
        this.fileds.filter(x=>x.nombre=='IdLocalidad')[0].valorInicial = '';
      }
      this.GetRegionesPorPais(e.value)
    }
    if(e.Nombre=='IdRegion'){
      this.formularioContacto.IdLocalidad=undefined
      this.GetLocalidadesPorRegion(e.value)
    }
  }
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.fileds.forEach(r=>{
          if(r.nombre=='IdRegion'){
            r.disable=false;
            r.data, r.filteredOptions=x.map((p:any)=>{
              var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
              return ps;
            })
            r.filteredOptionsAux=x.map((p:any)=>{
              var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
              return ps;
            })
          }
          // if(r.nombre=='IdLocalidad'){
          //   r.disable=true;
          //   r.hidden=true;
          // }
        })
        this.form.enablefield('IdRegion');
      }
    })
  }
  GetLocalidadesPorRegion(idRegion:number){
    this._RegionService.ObtenerLocalidadPorRegion(idRegion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if (x.length != 0 && x != undefined && x !=null ) {

          this.fileds.forEach(r=>{
            if(r.nombre=='IdLocalidad'){
              r.disable=false;
              r.hidden=false;
              r.data, r.filteredOptions=x.map((p:any)=>{
                var ps:Basic={Nombre:p.nombreLocalidad,value:p.codigo,longitudCelular:p.longitudCelular};
                return ps;
              })
              r.filteredOptionsAux=x.map((p:any)=>{
                var ps:Basic={Nombre:p.nombreLocalidad,value:p.codigo,longitudCelular:p.longitudCelular};
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
              r.hidden=true;
              r.validate=[];
            }
          })

        }
      }
    })
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
      validate: [],
      disable: true,
      hidden:true,
      label: 'Localidad',
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
    this.formularioContacto.IdPais= undefined,
    this.formularioContacto.IdRegion= undefined,
    this.formularioContacto.Movil= '',
    this.formularioContacto.IdCargo= undefined,
    this.formularioContacto.IdAreaTrabajo= undefined,
    this.formularioContacto.IdAreaFormacion= undefined,
    this.formularioContacto.IdIndustria= undefined,
    this.formularioContacto.Comentario= '',
    this.GetRegionesPorPais(-1);
  }
}

