import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';
import { DocenciaCalificarProyectoAplicacionModalComponent } from '../docencia-calificar-proyecto-aplicacion-modal/docencia-calificar-proyecto-aplicacion-modal.component';

@Component({
  selector: 'app-docencia-calificar-proyecto-aplicacion',
  templateUrl: './docencia-calificar-proyecto-aplicacion.component.html',
  styleUrls: ['./docencia-calificar-proyecto-aplicacion.component.scss']
})
export class DocenciaCalificarProyectoAplicacionComponent implements OnInit , OnChanges , OnDestroy{

  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  columnHeader = {
    'codigoMatricula'  : 'Código',
    'alumno': 'Nombre Alumno',
    'fechaEnvio': 'Fecha Entrega',
    'archivo': 'Archivo',
    'fechaCalificacion': 'Fecha Calificación',
    'nota': 'Nota',
    'Acciones': 'Acciones',
  };

  TipoContenido:any={
    archivo: ['url','urlArchivoSubido'],
    'Acciones': ['buttons','Calificar']
  }
  constructor(
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    public dialog: MatDialog,
  ) { }

  @Input() IdPEspecifico = 0;
  @Output() OnRecharge = new EventEmitter<void>();
  public proyectoAplicacionCurso: any;
  public NombreCurso=''
  public RegresarAhora=false;
  public TerminaCarga=false;
  ngOnInit(): void {
    this.RegresarAhora=false
    this.TerminaCarga=false;
    this.ObtenerProyectoAplicacionPorCursoDocente();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.RegresarAhora=false
    this.TerminaCarga=false;
    if(this.IdPEspecifico>0){
      this.ObtenerProyectoAplicacionPorCursoDocente()
    }
  }
  ObtenerProyectoAplicacionPorCursoDocente(){
    var datePipe = new DatePipe('en-US');
    this._TrabajoDeParesIntegraService
      .ListadoAlumnosCalificarPorPespecificoCongeladoV2(this.IdPEspecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
      next:x=>{
        console.log(x)
        this.proyectoAplicacionCurso=x
        if(this.proyectoAplicacionCurso!=null || this.proyectoAplicacionCurso!=undefined){
          this.NombreCurso=this.proyectoAplicacionCurso[0].pEspecifico
          this.proyectoAplicacionCurso.forEach((e:any) => {
          e.archivo=e.urlArchivoSubido==null?'Sin Archivo':'Descargar'
          e.Acciones=e.calificado==0?'Calificar':'Mostrar'
        });
        }
      }
    });
  }
  AbrirProyectoAplicacion(index:number){
    console.log(index)
    const dialogRef = this.dialog.open(DocenciaCalificarProyectoAplicacionModalComponent, {
      data: {
        idTarea:this.proyectoAplicacionCurso[index].idTarea,
      },
      panelClass: 'custom-dialog-docente-proyecto-aplicacion-modal',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      this.ObtenerProyectoAplicacionPorCursoDocente()
    });
  }
  Regresar(){
    this.RegresarAhora=true;
  }

}
