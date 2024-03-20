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
  CursoPadreDTO,
  ProgresoAlumnoProgramaAulaVirtualDTO,
  ProgresoAlumnoProgramaVideosAulaVirtualDTO,
} from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { AlumnosTest } from 'src/app/Core/Shared/AlumnosTest';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

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
    private _SnackBarServiceService:SnackBarServiceService,
    private router :Router,
    private _AlumnosTest:AlumnosTest,
    private _HelperService:HelperService
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
    programaGeneral: ''
  };
  public cargaProgrso=false
  public progressProgram:any
  @Input() idMatricula = 0;
  public OpenVideoModulo=true

  ngOnInit(): void {
    if (this.idMatricula > 0) {
     // this.ObtenerProgresoAulaVirtual();
      this.ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo();
      console.log(this.programEstructura)
      console.log(this.programEstructura.listaCursoMatriculado)
      this.validarFechasOnline()
    }
  }
  ngOnChanges(changes: SimpleChanges): void {}
  ObtenerProgresoAulaVirtual() {
    this._ProgramaContenidoService
      .ProgresoProgramaCursosAulaVirtualAonline(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.cargaProgrso=true
          console.log(x)
          this.progresoPrograma = x;
          this.AddProgresToProgram();
        },
        complete:()=>{
          this.cargaProgrso=true
        }
      });
  }
  validarFechasOnline(){
    console.log(this.programEstructura.listaCursoMatriculado)
    this.programEstructura.listaCursoMatriculado.forEach(c => {
      c.fechasOnlineActive=false
      if(c.fechasOnline!=undefined  && c.fechasOnline!=null ){
        if(c.idModalidadHijo!=1){

          let fi=new Date((new Date(c.fechasOnline.fechaInicio)).getFullYear(),(new Date(c.fechasOnline.fechaInicio)).getMonth(),(new Date(c.fechasOnline.fechaInicio)).getDate());
          let fa=new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate());
          let ff=new Date((new Date(c.fechasOnline.fechaFin)).getFullYear(),(new Date(c.fechasOnline.fechaFin)).getMonth(),(new Date(c.fechasOnline.fechaFin)).getDate());
          console.log(fi,fa,ff);
          if(fa>=fi && fa<=ff){
            c.fechasOnlineActive=true
          }
        }
      }
    });
  }
  ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo() {
    this.cargaProgrso=false
    this._ProgramaContenidoService
      .ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.cargaProgrso=true
          console.log(x)
          this.progressProgram=x
          this.AddProgresToProgramV2();

        },
        complete:()=>{
          this.cargaProgrso=true
        }
      });
  }
  AddProgresToProgramV2() {
    var index=0;
    var lastconvalidado=-1;
    var alumnoTest=this._AlumnosTest.Allpermisions(this.programEstructura.idAlumno);
    var cantidad :number =0
    var cantidadRealizada:number=0
    this.programEstructura.listaCursoMatriculado.forEach((program) => {
      cantidad=0
      cantidadRealizada=0
      program.habilitado=true;
      this.progressProgram.progresoEncuesta.forEach((encuesta:any) => {
        if (program.idPEspecificoHijo == encuesta.idPEspecificoHijo) {
          cantidad+=encuesta.examenProgramados
          cantidadRealizada+=encuesta.examenRealizado
        }
      });
      this.progressProgram.progresoTarea.forEach((tarea:any) => {
        if (program.idPEspecificoHijo == tarea.idPEspecificoHijo) {
          cantidad+=tarea.tareasProgramadas
          cantidadRealizada+=tarea.tareasRealizadas
        }
      });
      this.progressProgram.progresoVideo.forEach((video:any) => {
        if (program.idPEspecificoHijo == video.idPEspecificoHijo) {
          cantidad+=video.videosTotal
          cantidadRealizada+=video.videosTerminados
        }
      });
      program.porcentaje = cantidadRealizada*100/cantidad;

      if(program.convalidado==false && program.idModalidadHijo==1 && !alumnoTest){
        if(lastconvalidado>-1){
          var conval=this.programEstructura.listaCursoMatriculado[lastconvalidado]
          if(conval.porcentaje<=98){
            program.habilitado=false
          }
        }
        lastconvalidado=index
      }
      index++
    });
    console.log(this.programEstructura)
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
    console.log('---------'+habilitado+'---------------')
    if(habilitado==true){
      this.router.navigate(['/AulaVirtual/MisCursos/'+idMatricula+'/'+idPEspecificoHijo])
    }else{
      this._SnackBarServiceService.openSnackBar("Debes completar las actividades anteriores para continuar con esta actividad",'x',10,"snackbarCrucigramaerror");
    }
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Modulos'})
  }
}
