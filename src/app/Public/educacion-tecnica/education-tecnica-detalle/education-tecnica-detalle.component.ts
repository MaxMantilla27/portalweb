import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _CarreraProfesionalService: CarreraProfesionalService,
    private _EstructuraCurricularService: EstructuraCurricularService,
  ) { }

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
        let almDescripcionEstructura: any =  this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Descripción Estructura'])
        this.descripcionEstructuraCurricular = '<p>'+almDescripcionEstructura[0].contenido.replaceAll('<vacio></vacio>','')+'</p>'
        console.log(this.descripcionEstructuraCurricular)
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
}
