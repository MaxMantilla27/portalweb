import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CarreraProfesionalService} from "../../../Core/Shared/Services/Carrera/carrera-profesional.service";
import {CarreraProfesionalTecnicaDetalleDTO} from "../../../Core/Models/ProgramaDTO";

@Component({
  selector: 'app-carrera-profesional-detalle',
  templateUrl: './carrera-profesional-detalle.component.html',
  styleUrls: ['./carrera-profesional-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarreraProfesionalDetalleComponent implements OnInit {

  public migaPan: any = [];
  //public carrera: CarreraProfesionalTecnicaDetalleDTO = {};
  public carrera: any = {};
  public generalInformacion: any = [];
  public contenidoCertificacionAdicional: String = '';
  public notaCertificacionAdicional: String = '';
  public planEstudios: any;
  public rutaImagen: string = 'https://img.bsginstitute.com/repositorioweb/img/carreras/';

  public loader: boolean = false

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _CarreraProfesionalService: CarreraProfesionalService,
  ) { }

  ngOnInit(): void {
    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Carreras Profesionales',
        urlWeb: '/carreras-profesionales'
      }
    ]
    this.activatedRoute.params.subscribe((params) => {
      //Lo separamos en partes
      let auxParams = params["urlWeb"].split('-')
      let idBusqueda = auxParams[auxParams.length -1]
      let nombre = auxParams.splice(0,auxParams.length -1).toString().replace(/,/g,' ')
      //Se elimina el texto por defecto
      let nombreCorto = nombre.replace('Carrera Profesional en','')
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
    this._CarreraProfesionalService.GetCarrerasDetalle(idBusqueda, nombre).subscribe({
      next:(x)=>{
        this.carrera = x.programaInformacionDTO
        //Separamos los contenidos
        this.generalInformacion = this.carrera.contenidoProgramaInformacionDTO.filter(function(contenido: any) {
          if(contenido.titulo === 'Perfil del Egresado' || contenido.titulo === 'Mercado Laboral'
            || contenido.titulo === 'Duración y Horarios' || contenido.titulo === 'Mercado Laboral') {
            return contenido
          }
        })
        //Plan de Estudios
        //this.planEstudios = this.carrera.contenidoProgramaInformacionDTO[2]
        this.planEstudios = "<div class='real-contenedor'>"+this.carrera.contenidoProgramaInformacionDTO[2].contenido.replaceAll("<p><strong>","<div class='container-card'><p><strong>").
        replaceAll("</ul><div class='container-card'>","</ul></div><div class='container-card'>")+"</div></div>"
        this.planEstudios = this.planEstudios.replaceAll("</strong></p>","</strong></p><div class='line'></div>")
        //Separamos el contenido de la nota en certificaicones adicionales
        console.log(this.planEstudios)
        this.contenidoCertificacionAdicional = this.carrera.contenidoProgramaInformacionDTO[8].contenido.split("<p>&nbsp;</p><div><p><strong>NOTA</strong>")[0]
        this.notaCertificacionAdicional = this.carrera.contenidoProgramaInformacionDTO[8].contenido.split("<p>&nbsp;</p>")[6]
        this.loader = true
      },
      error:(x)=>{console.log(x)}
    });
  }

}
