import { Component, Input, OnInit } from '@angular/core';
import { CarreraProfesionalTecnicaDTO } from 'src/app/Core/Models/ProgramaDTO';
import { CarreraProfesionalService } from 'src/app/Core/Shared/Services/Carrera/carrera-profesional.service';

@Component({
  selector: 'app-carreras-profesionales',
  templateUrl: './carreras-profesionales.component.html',
  styleUrls: ['./carreras-profesionales.component.scss']
})
export class CarrerasProfesionalesComponent implements OnInit {

  public carreras: Array<CarreraProfesionalTecnicaDTO> = [];
  public encabezado: any = {};
  public confs: Object = {}
  public migaPan: any = []
  constructor(
    private _CarreraProfesionalService: CarreraProfesionalService,
  ) {}

  ngOnInit(): void {
    this.getCarreras();
    this.confs = {
      titulo: 'Descubre Más >',
      color: 'primary'
    }
    this.encabezado = {
      titulo: 'Carreras Profesionales',
      duracion: '(3 años)',
      descripcion: 'Nuestros módulos ocupacionales están enfocados en brindar una formación de primer nivel y han sido '+
      'desarrollados por expertos en la industria para que nuestros estudiantes desarrollen las habilidades más demandadas en el mercado laboral.'
    }
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
  }
  getCarreras(){
    this._CarreraProfesionalService.GetCarrerasVista(11).subscribe({
      next:(x)=>{
        this.carreras = x.listaProfesionVistaDTO.map(function(carrera: any) {
          carrera.imagen = 'https://img.bsginstitute.com/repositorioweb/img/carreras/'  + carrera.imagen
          carrera.urlWeb = '/carrera/'+carrera.titulo.replace(/ /g, "-")+'-'+carrera.idBusqueda
          return carrera
        })
      },
      error:(x)=>{console.log(x)}
    });
  }

}
