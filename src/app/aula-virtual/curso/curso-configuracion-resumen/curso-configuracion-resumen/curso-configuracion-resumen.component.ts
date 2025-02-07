import { Component, OnInit } from '@angular/core';
import { ConfiguracionResumenGrabacionesService } from 'src/app/Core/Shared/Services/ConfiguracionResumenGrabaciones/configuracion-resumen-grabaciones.service';

@Component({
  selector: 'app-curso-configuracion-resumen',
  templateUrl: './curso-configuracion-resumen.component.html',
  styleUrls: ['./curso-configuracion-resumen.component.scss']
})
export class CursoConfiguracionResumenComponent implements OnInit {
  idMatriculaCabecera: number = 0;
  idPGeneral: number = 0;

  pdfChecked: boolean = false;
  mapaConceptualChecked: boolean = false;
  audioChecked: boolean = false;
  videoChecked: boolean = false;
  correoChecked: boolean = false;
  whatsAppChecked: boolean = false;

  isLoading: boolean = false;

  constructor(
    private _ConfiguracionResumenGrabacionesService: ConfiguracionResumenGrabacionesService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.idMatriculaCabecera = this._ConfiguracionResumenGrabacionesService.getIdMatriculaCabecera() ?? 0;
    this.idPGeneral = this._ConfiguracionResumenGrabacionesService.getIdPGeneral() ?? 0;
    this.obtenerConfiguracion();
  }

  obtenerConfiguracion() {
    this.pdfChecked = false;
    this.mapaConceptualChecked = false;
    this.audioChecked = false;
    this.videoChecked = false;
    this.correoChecked = false;
    this.whatsAppChecked = false;

    this._ConfiguracionResumenGrabacionesService.ObtenerListaConfiguracionResumenProgramaPorMatriculaProgramaGeneral(this.idMatriculaCabecera, this.idPGeneral)
    .subscribe({
      next: (x) => {
        console.log('Datos recibidos:', x);
        if (x.datosMatriculaConfiguracionResumenPrograma && x.datosMatriculaConfiguracionResumenPrograma.length > 0) {
          const firstElement = x.datosMatriculaConfiguracionResumenPrograma[0];
          this.correoChecked = firstElement.envioCorreo;
          this.whatsAppChecked = firstElement.envioWhatsApp;

          x.datosMatriculaConfiguracionResumenPrograma.forEach((element: any) => {
            if (element.idResumenGrabacionOnline === 1) {
              this.pdfChecked = element.estado;
            }
            if (element.idResumenGrabacionOnline === 2) {
              this.mapaConceptualChecked = element.estado;
            }
            if (element.idResumenGrabacionOnline === 3) {
              this.audioChecked = element.estado;
            }
            if (element.idResumenGrabacionOnline === 4) {
              this.videoChecked = element.estado;
            }
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener los datos:', err);
        this.isLoading = false;
      }
    });
  }

  actualizarConfiguracionResumen() {
    this.isLoading = true;
    const usuario = 'portalWeb';
    const listaDatos = [
      {
        IdMatriculaCabecera: this.idMatriculaCabecera,
        IdResumenGrabacionOnline: 1,
        IdPGeneral: this.idPGeneral,
        EnvioCorreo: this.correoChecked,
        EnvioWhatsApp: this.whatsAppChecked,
        Estado: this.pdfChecked,
        Usuario: usuario
      },
      {
        IdMatriculaCabecera: this.idMatriculaCabecera,
        IdResumenGrabacionOnline: 2,
        IdPGeneral: this.idPGeneral,
        EnvioCorreo: this.correoChecked,
        EnvioWhatsApp: this.whatsAppChecked,
        Estado: this.mapaConceptualChecked,
        Usuario: usuario
      },
      {
        IdMatriculaCabecera: this.idMatriculaCabecera,
        IdResumenGrabacionOnline: 3,
        IdPGeneral: this.idPGeneral,
        EnvioCorreo: this.correoChecked,
        EnvioWhatsApp: this.whatsAppChecked,
        Estado: this.audioChecked,
        Usuario: usuario
      },
      {
        IdMatriculaCabecera: this.idMatriculaCabecera,
        IdResumenGrabacionOnline: 4,
        IdPGeneral: this.idPGeneral,
        EnvioCorreo: this.correoChecked,
        EnvioWhatsApp: this.whatsAppChecked,
        Estado: this.videoChecked,
        Usuario: usuario
      }
    ];
    this._ConfiguracionResumenGrabacionesService.InsertarActualizarListaMatriculaConfiguracionResumenPrograma(listaDatos)
    .subscribe({
      next: (x) => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al insertar los datos:', err);
        this.isLoading = false;
      }
    });
  }

  cancelarConfiguracionResumen() {

  }
}
