import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO, FormularioContactoShortDTO } from 'src/app/Core/Models/FormularioDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/Helper/helper.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import {CarreraProfesionalService} from "../../../Core/Shared/Services/Carrera/carrera-profesional.service";
import { HelperService as Help} from 'src/app/Core/Shared/Services/helper.service';
import {
  EstructuraCurricularService
} from "../../../Core/Shared/Services/EstructuraCurricular/estructura-curricular.service";
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { Subject, takeUntil } from 'rxjs';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-education-tecnica-detalle',
  templateUrl: './education-tecnica-detalle.component.html',
  styleUrls: ['./education-tecnica-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class EducationTecnicaDetalleComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  public migaPan: any = [];
  //public carrera: CarreraProfesionalTecnicaDetalleDTO = {};
  public carrera: any = {};
  //Secciones del programa
  public generalInformacion: any = [];
  public montoPagoPrograma: any = {};
  public certificaciones: any = [];
  public estructuraCurricular: any = [];
  public descripcionEstructuraCurricular: any;



  public rutaImagen: string = 'https://img.bsginstitute.com/repositorioweb/img/carreras/';

  public loader: boolean = false

  public fecha=new Date();
  public fechaInicio='Por definir';
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _CarreraProfesionalService: CarreraProfesionalService,
    private _EstructuraCurricularService: EstructuraCurricularService,
    private _RegionService:RegionService,
    private _DatosPortalService:DatosPortalService,
    private _HelperService: HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _HelperServiceP:Help,
    private _SeoService:SeoService,
    private title:Title,
    private _SessionStorageService:SessionStorageService,

  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoShortDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
  }
  public DatosEnvioFormulario: ContactenosDTO={
    Nombres:'',
    Apellidos:'',
    Correo1:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
    IdCargo:undefined,
    IdAreaFormacion:undefined,
    IdAreaTrabajo:undefined,
    IdIndustria:undefined
  }
  public positionDiv=0;
  public combosPrevios:any
  public IdPespecificoPrograma=0;

  ngOnInit(): void {
    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Educación Técnica',
        urlWeb: '/tecnicos-productivos'
      }
    ]
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe((params) => {
      //Lo separamos en partes
      console.log(params)
      let auxParams = params["urlWeb"].split('-')
      let idBusqueda = auxParams[auxParams.length -1]
      let nombre = auxParams.splice(0,auxParams.length -1).toString().replace(/,/g,' ')
      //Insertamos la ruta en la miga de pan
      this.migaPan.push({
        titulo: nombre,
        urlWeb: params["urlWeb"]
      })
      this.getCarreraDetalle(idBusqueda, nombre)
    });
    this._HelperServiceP.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.combosPrevios=x.datosAlumno;
      console.log(this.combosPrevios)
      this.formularioContacto.Nombres= this.combosPrevios.nombres,
      this.formularioContacto.Apellidos= this.combosPrevios.apellidos,
      this.formularioContacto.Email= this.combosPrevios.email,
      this.formularioContacto.IdPais= this.combosPrevios.idPais,
      this.formularioContacto.IdRegion= this.combosPrevios.idDepartamento,
      this.formularioContacto.Movil= this.combosPrevios.telefono
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
    });
    console.log(this.migaPan)
    this.AddFields();
    this.ObtenerCombosPortal();
  }
  getCarreraDetalle(idBusqueda:number, nombre:string){
    this._CarreraProfesionalService.GetEducacionTecnicaDetalle(idBusqueda, nombre).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.IdPespecificoPrograma = x.programaInformacionDTO.programaEspecificoInformacionDTO[0].id
        console.log(this.IdPespecificoPrograma)
        if(x.programaInformacionDTO!=undefined && x.programaInformacionDTO.parametroSeoProgramaDTO!=undefined){
          var metas=x.programaInformacionDTO.parametroSeoProgramaDTO;
          if(metas!=null && metas.length>0){

            let mt=metas.find((par:any)=>par.nombre=='Titulo Pestaña')!=undefined?
                      metas.find((par:any)=>par.nombre=='Titulo Pestaña').descripcion:undefined
            let t=metas.find((par:any)=>par.nombre=='title')!=undefined?
                      metas.find((par:any)=>par.nombre=='title').descripcion:undefined
            let d=metas.find((par:any)=>par.nombre=='description')!=undefined?
                      metas.find((par:any)=>par.nombre=='description').descripcion:undefined
            let k=metas.find((par:any)=>par.nombre=='keywords')!=undefined?
                      metas.find((par:any)=>par.nombre=='keywords').descripcion:undefined
            console.log(mt)
            this.title.setTitle(mt);

            this._SeoService.generateTags({
              title:t,
              slug:this.router.url.toString(),
              description:d,
              keywords:k,
              image:'https://img.bsginstitute.com/repositorioweb/img/carreras/'+x.programaInformacionDTO.programaGeneralInformacionVistaDTO.imagenPrograma,
              ogTitle:mt,
              twiterTitle:mt,
              ogDescription:d,
              twiterDescription:d,
              imageW:"348",
              imageH:'220',
            });

          }
        }

        this.carrera = x.programaInformacionDTO
        //Informacion General
        this.generalInformacion = this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Perfil del Egresado', 'Duración y Horarios', 'Mercado Laboral'])
        //Montos pago
        this.montoPagoPrograma = `1 matrícula de ${this.carrera.montoPagoProgramaInformacionDTO.simbolo}${Math.round(this.carrera.montoPagoProgramaInformacionDTO.matricula)} y ${this.carrera.montoPagoProgramaInformacionDTO.nroCuotas} pensiones de  ${this.carrera.montoPagoProgramaInformacionDTO.simbolo}${Math.round(this.carrera.montoPagoProgramaInformacionDTO.cuotas)}`
        //Certificaciones
        let almCertificacion: any =  this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Certificación'])
        this.certificaciones = almCertificacion[0].contenido
        //Estructura curricular
        this.getEstructuraCurricularEstudacionTecnica(idBusqueda)
        this.carrera.programaEspecificoInformacionDTO?.forEach((element:any) => {
          var fecha=new Date(element.fechaCreacion);
          if(fecha.getFullYear()==this.fecha.getFullYear() && element.fechaInicioTexto!=null){
            this.fechaInicio=element.fechaInicioTexto
          }
        });
      },
      error:(x)=>{console.log(x)}
    });
  }
  getEstructuraCurricularEstudacionTecnica(idBusqueda: number) {
    this._EstructuraCurricularService.GetEstructuraCarreraTecnicaPortal(idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.estructuraCurricular = x.estructuraCurso
        this.estructuraCurricular.map((x:any)=>{
          x.opened=false
        })
        this.loader = true
      },
      error:(x)=>{console.log(x)}
    });
  }
  filtrarContenido (contenido: Array<string>, condiciones: Array<string>) {
    return contenido.filter(function(cont: any) {
      for(let j = 0 ; j < condiciones.length ; j++) {
        if(condiciones[j] === cont.titulo){
          return cont
        }
      }
    })
  }
  ScrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }
  tonumber(valor:any){
    console.log(valor)
    return parseInt(valor);
  }
  SetContacto(value:any){

    if(!this.formVal){

      this._SnackBarServiceService.openSnackBar("Debes completar todos los campos",'x',10,"snackbarCrucigramaerror");
    }else{
      this.initValues = false;
      this.DatosEnvioFormulario.Nombres=value.Nombres;
      this.DatosEnvioFormulario.Apellidos=value.Apellidos;
      this.DatosEnvioFormulario.Correo1=value.Email;
      this.DatosEnvioFormulario.IdPais=value.IdPais;
      this.DatosEnvioFormulario.IdRegion=value.IdRegion;
      this.DatosEnvioFormulario.Movil=value.Movil;
      this.DatosEnvioFormulario.IdCargo=value.IdCargo;
      this.DatosEnvioFormulario.IdAreaFormacion=value.IdAreaFormacion;
      this.DatosEnvioFormulario.IdAreaTrabajo=value.IdAreaTrabajo;
      this.DatosEnvioFormulario.IdIndustria=value.IdIndustria;
      var IdPespecifico=this._SessionStorageService.SessionGetValueSesionStorage("IdPEspecificoPublicidad");
      var IdCategoriaDato=this._SessionStorageService.SessionGetValueSesionStorage("idCategoria");
      this.DatosEnvioFormulario.IdCategoriaDato=IdCategoriaDato==''?0:parseInt(IdCategoriaDato);
      if(IdPespecifico==''){
        this.DatosEnvioFormulario.IdPespecifico=this.IdPespecificoPrograma;
      }else{
        this.DatosEnvioFormulario.IdPespecifico=parseInt(IdPespecifico)
      };
      console.log(this.DatosEnvioFormulario)
      this._HelperService.EnviarFormulario(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          console.log(x);
          this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
        },
        complete: () => {
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
  }
  LimpiarCampos(){
    this.combosPrevios=undefined;
    this.formularioContacto.Nombres= '',
      this.formularioContacto.Apellidos= '',
      this.formularioContacto.Email= '',
      this.formularioContacto.IdPais=0,
      this.formularioContacto.IdRegion=0,
      this.formularioContacto.Movil= '',
      this.GetRegionesPorPais(-1);
  }
}
