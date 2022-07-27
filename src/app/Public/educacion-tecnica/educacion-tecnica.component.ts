import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CarreraProfesionalTecnicaDTO } from 'src/app/Core/Models/ProgramaDTO';
import { CarreraProfesionalService } from 'src/app/Core/Shared/Services/Carrera/carrera-profesional.service';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';

@Component({
  selector: 'app-educacion-tecnica',
  templateUrl: './educacion-tecnica.component.html',
  styleUrls: ['./educacion-tecnica.component.scss']
})
export class EducacionTecnicaComponent implements OnInit {

  public carreras: Array<CarreraProfesionalTecnicaDTO> = [];
  public encabezado: any = {};
  public confs: Object = {};
  public migaPan: any = []
  constructor(
    private _CarreraProfesionalService: CarreraProfesionalService,
    private _SeoService: SeoService,
    private title: Title,
    private router: Router,
  ) {}

  ngOnInit(): void {

    let t: string = 'Educación Técnico Productiva';
    this.title.setTitle(t);
    this._SeoService.generateTags({
      title: t,
      slug: this.router.url.toString(),
      description:
        'Carreras Profesionales en Administración, Computación, Explotación Minera, Concentración de Minerales y Mantenimiento de Maquinaria en Lima y Arequipa',
      keywords:
        'carreras tecnicas, carreras profesionales, carreras para estudiar, carrera profesional',
    });

    console.log('Nero')
    this.getCarreras();
    this.confs = {
      titulo: 'Descubre Más >',
      color: 'primary'
    }
    this.encabezado = {
      titulo: 'Educación técnica',
      duracion: '',
      descripcion: 'Nuestras carreras profesionales están enfocadas en brindar una formación de primer nivel y '+
      'buscan desarrollar las capacidades de nuestros estudiantes para generar proyectos de emprendimiento e innovación '+
      'que lleven a la creación de nuevas empresas. '
    }
    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/'
      },
      {
        titulo: 'Educación Técnico Productivo',
        urlWeb: '/tecnicos-productivos'
      },
    ]
  }
  getCarreras(){
    this._CarreraProfesionalService.GetCarrerasVista(16).subscribe({
      next:(x)=>{
        console.log(x)
        this.carreras = x.listaProfesionVistaDTO.map(function(carrera: any) {
          carrera.imagen = 'https://img.bsginstitute.com/repositorioweb/img/carreras/'  + carrera.imagen
          carrera.urlWeb = '/tecnico-productivo/'+carrera.titulo.replace(/ /g, "-")+'-'+carrera.idBusqueda
          return carrera
        })

      },
      error:(x)=>{console.log(x)}
    });
  }

}
