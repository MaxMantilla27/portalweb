import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {CarreraProfesionalService} from "../../../Core/Shared/Services/Carrera/carrera-profesional.service";
import {
  EstructuraCurricularService
} from "../../../Core/Shared/Services/EstructuraCurricular/estructura-curricular.service";

@Component({
  selector: 'app-education-tecnica-detalle',
  templateUrl: './education-tecnica-detalle.component.html',
  styleUrls: ['./education-tecnica-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class EducationTecnicaDetalleComponent implements OnInit {

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
  ) { }

  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoShortDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
  }
  public DatosEnvioFormulario: ContactenosDTO={
    Nombres:'',
    Apellidos:'',
    Correo1:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
    IdCargo:0,
    IdAreaFormacion:0,
    IdAreaTrabajo:0,
    IdIndustria:0
  }
  public positionDiv=0;
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
    this.activatedRoute.params.subscribe((params) => {
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
    })
    console.log(this.migaPan)
    this.AddFields();
    this.ObtenerCombosPortal();
  }
  getCarreraDetalle(idBusqueda:number, nombre:string){
    this._CarreraProfesionalService.GetEducacionTecnicaDetalle(idBusqueda, nombre).subscribe({
      next:(x)=>{
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
    this._EstructuraCurricularService.GetEstructuraCarreraTecnicaPortal(idBusqueda).subscribe({
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

  tonumber(valor:any){
    console.log(valor)
    return parseInt(valor);
  }
  SetContacto(value:any){
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
    console.log(this.DatosEnvioFormulario)
    this._HelperService.EnviarFormulario(this.DatosEnvioFormulario).subscribe({
      next: (x) => {
        console.log(x);
      },
      complete: () => {
        this.statuscharge = false;
      },
    });
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().subscribe({
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
    this._RegionService.ObtenerCiudadesPorPais(idPais).subscribe({
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
}
