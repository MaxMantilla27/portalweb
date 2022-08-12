import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import {
  ProgresoAlumnoProgramaAulaVirtualDTO,
  CursoPadreDTO,
  ProgresoAlumnoProgramaVideosAulaVirtualDTO,
} from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { AlumnosTest } from 'src/app/Core/Shared/AlumnosTest';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso-modulos',
  templateUrl: './curso-modulos.component.html',
  styleUrls: ['./curso-modulos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoModulosComponent implements OnInit, OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService: SessionStorageService,
    private router :Router,
    private _AlumnosTest:AlumnosTest
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

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
    if (this.idMatricula > 0) {
      this.ObtenerProgresoAulaVirtual();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {}
  ObtenerProgresoAulaVirtual() {
    this._ProgramaContenidoService
      .ProgresoProgramaCursosAulaVirtualAonline(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.progresoPrograma = x;
          this.AddProgresToProgram();
        },
      });
  }
  AddProgresToProgram() {
    var index=0;
    var lastconvalidado=-1;
    var alumnoTest=this._AlumnosTest.Allpermisions(this.programEstructura.idAlumno);
    this.programEstructura.listaCursoMatriculado.forEach((program) => {
      program.habilitado=true;
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
      if(program.convalidado==false && program.idModalidadHijo==1 && !alumnoTest){
        if(lastconvalidado>-1){
          var conval=this.programEstructura.listaCursoMatriculado[lastconvalidado]
          if(conval.progreso.progresoVideo.length>0){
            if(conval.progreso.progresoVideo[0].porcentaje<=98){
              program.habilitado=false
            }
          }else{
            program.habilitado=false
          }
          if(program.habilitado==true){
            if(conval.progreso.progresoEncuesta.length>0){
              if(conval.progreso.progresoEncuesta[0].porcentajeAvance<=98){
                program.habilitado=false
              }
            }
          }
          if(program.habilitado==true){
            if(conval.progreso.progresoTarea.length>0){
              if(conval.progreso.progresoTarea[0].porcentajeAvance<=98){
                program.habilitado=false
              }
            }
          }
        }
        lastconvalidado=index
      }
      index++
    });
    console.log(this.programEstructura)
  }
  IrCurso(idMatricula:number,idPEspecificoHijo:number,habilitado:boolean){
    if(habilitado==true){
      this.router.navigate(['/AulaVirtual/MisCursos/'+idMatricula+'/'+idPEspecificoHijo])
    }
  }
}
