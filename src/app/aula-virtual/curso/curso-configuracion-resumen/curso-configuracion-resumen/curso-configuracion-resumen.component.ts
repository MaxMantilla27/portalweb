import { Component, OnInit } from '@angular/core';
import { ConfiguracionResumenGrabacionesService } from 'src/app/Core/Shared/Services/ConfiguracionResumenGrabaciones/configuracion-resumen-grabaciones.service';

@Component({
  selector: 'app-curso-configuracion-resumen',
  templateUrl: './curso-configuracion-resumen.component.html',
  styleUrls: ['./curso-configuracion-resumen.component.scss']
})
export class CursoConfiguracionResumenComponent implements OnInit {

  constructor(
    private _ConfiguracionResumenGrabacionesService: ConfiguracionResumenGrabacionesService
  ) { }

  ngOnInit(): void {
    this.obtenerConfiguracion();
  }

  obtenerConfiguracion() {
    const idMatriculaCabecera = 123;
    const idPGeneral = 456;
  
    this._ConfiguracionResumenGrabacionesService.ObtenerListaConfiguracionResumenProgramaPorMatriculaProgramaGeneral(idMatriculaCabecera, idPGeneral)
    .subscribe({
      next: (x) => {
        console.log('Datos recibidos:', x);
      },
      error: (err) => {
        console.error('Error al obtener los datos:', err);
      }
    });
  }

  guardarActualizarConfiguracionResumen() {

  }

  cancelarConfiguracionResumen() {

  }
}
