import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CarreraProfesionalService} from "../../../Core/Shared/Services/Carrera/carrera-profesional.service";
import {
  EstructuraCurricularService
} from "../../../Core/Shared/Services/EstructuraCurricular/estructura-curricular.service";

@Component({
  selector: 'app-education-tecnica-detalle',
  templateUrl: './education-tecnica-detalle.component.html',
  styleUrls: ['./education-tecnica-detalle.component.scss']
})
export class EducationTecnicaDetalleComponent implements OnInit {

  public migaPan: any = [];
  //public carrera: CarreraProfesionalTecnicaDetalleDTO = {};
  public carrera: any = {};
  public generalInformacion: any = [];
  public contenidoCertificacionAdicional: String = '';
  public notaCertificacionAdicional: String = '';
  public planEstudios: any = [];
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
        urlWeb: '/tecnico-productivo'
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
        this.generalInformacion = this.carrera.contenidoProgramaInformacionDTO.filter(function(contenido: any) {
           if(contenido.titulo === 'Perfil del Egresado' || contenido.titulo === 'Mercado Laboral'
             || contenido.titulo === 'Duración y Horarios') {
             return contenido
          }
        })
        this.getEstructuraCurricularEstudacionTecnica(idBusqueda)
      },
      error:(x)=>{console.log(x)}
    });
  }
  getEstructuraCurricularEstudacionTecnica(idBusqueda: number) {
    this._EstructuraCurricularService.GetEstructuraCarreraTecnicaPortal(idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.planEstudios = x.estructuraCurso
        this.planEstudios.map((x:any)=>{
          x.opened=false
        })
        console.log(this.planEstudios)
        this.loader = true
        /*this.carrera = x.programaInformacionDTO
        console.log(this.carrera)
        this.loader = true
        this.generalInformacion = this.carrera.contenidoProgramaInformacionDTO.filter(function(contenido: any) {
          if(contenido.titulo === 'Perfil del Egresado' || contenido.titulo === 'Mercado Laboral'
            || contenido.titulo === 'Duración y Horarios') {
            return contenido
          }
        })*/
      },
      error:(x)=>{console.log(x)}
    });
  }

  verifyIndex(event: any) {
    console.log(event)
  }
}
