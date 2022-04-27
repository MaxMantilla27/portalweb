import { Component, OnInit } from '@angular/core';
import { CarreraProfesionalTecnicaDTO } from 'src/app/Core/Models/ProgramaDTO';
import { CarreraProfesionalService } from 'src/app/Core/Shared/Services/Carrera/carrera-profesional.service';

@Component({
  selector: 'app-carreras-profesionales',
  templateUrl: './carreras-profesionales.component.html',
  styleUrls: ['./carreras-profesionales.component.scss']
})
export class CarrerasProfesionalesComponent implements OnInit {

  public carreras: Array<CarreraProfesionalTecnicaDTO> = [];
  public root: string = 'https://img.bsginstitute.com/repositorioweb/img/carreras/'
  constructor(
    private _CarreraProfesionalService: CarreraProfesionalService,
  ) {}

  ngOnInit(): void {
    this.getCarreras();
  }
  getCarreras(){
    this._CarreraProfesionalService.GetCarrerasVista(11).subscribe({
      next:(x)=>{
        this.carreras = x.listaProfesionVistaDTO
      },
      error:(x)=>{console.log(x)}
    });
  }

}
