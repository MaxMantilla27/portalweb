import { Component, OnInit } from '@angular/core';
import { CarreraProfesionalTecnicaDTO } from 'src/app/Core/Models/ProgramaDTO';
import { CarreraProfesionalService } from 'src/app/Core/Shared/Services/Carrera/carrera-profesional.service';

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
  ) {}

  ngOnInit(): void {
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
