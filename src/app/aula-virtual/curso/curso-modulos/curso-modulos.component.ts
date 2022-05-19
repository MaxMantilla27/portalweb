import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import {
  ProgresoAlumnoProgramaAulaVirtualDTO,
  CursoPadreDTO,
  ProgresoAlumnoProgramaVideosAulaVirtualDTO,
} from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso-modulos',
  templateUrl: './curso-modulos.component.html',
  styleUrls: ['./curso-modulos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoModulosComponent implements OnInit, OnChanges {
  constructor(
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService: SessionStorageService
  ) {}

  public progresoPrograma: ProgresoAlumnoProgramaAulaVirtualDTO = {
    progresoEncuesta: [],
    progresoTarea: [],
    progresoVideo: [],
  };
  @Input() programEstructura: CursoPadreDTO = {
    idAlumno: 0,
    idMatriculaCabecera: 0,
    idModalidad: 0,
    idPEspecifico: 0,
    idPGeneral: 0,
    listaCursoMatriculado: [],
    modalidad: '',
    programaGeneral: '',
  };
  @Input() idMatricula = 0;
  ngOnInit(): void {
    console.log(this.programEstructura);
    if (this.idMatricula > 0) {
      this.ObtenerProgresoAulaVirtual();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {}
  ObtenerProgresoAulaVirtual() {
    this._ProgramaContenidoService
      .ObtenerProgresoAulaVirtual(this.idMatricula)
      .subscribe({
        next: (x) => {
          this.progresoPrograma = x;
          this.AddProgresToProgram();
          console.log(x);
        },
      });
  }
  AddProgresToProgram() {
    this.programEstructura.listaCursoMatriculado.forEach((program) => {
      var progresoP: ProgresoAlumnoProgramaAulaVirtualDTO = {
        progresoEncuesta: [],
        progresoTarea: [],
        progresoVideo: [],
      };
      this.progresoPrograma.progresoEncuesta.forEach((encuesta) => {
        if (program.idPGeneralHijo == encuesta.idPGeneralHijo) {
          progresoP.progresoEncuesta.push(encuesta);
        }
      });
      this.progresoPrograma.progresoTarea.forEach((tarea) => {
        if (program.idPGeneralHijo == tarea.idPGeneralHijo) {
          progresoP.progresoTarea.push(tarea);
        }
      });
      this.progresoPrograma.progresoVideo.forEach((video) => {
        if (program.idPGeneralHijo == video.idPGeneralHijo) {
          progresoP.progresoVideo.push(video);
        }
      });
      program.progreso = progresoP;
    });
    console.log(this.programEstructura);
  }
}
