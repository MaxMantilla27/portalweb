import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';
import { DocenciaCalificarTrabajoParesModalComponent } from '../docencia-calificar-trabajo-pares-modal/docencia-calificar-trabajo-pares-modal.component';
@Component({
  selector: 'app-docencia-calificar-trabajo-pares',
  templateUrl: './docencia-calificar-trabajo-pares.component.html',
  styleUrls: ['./docencia-calificar-trabajo-pares.component.scss']
})
export class DocenciaCalificarTrabajoParesComponent implements OnInit , OnChanges , OnDestroy{

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
    archivo: ['url','urlArchivo'],
    'Acciones': ['buttons','calificado']
  }
  constructor(
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    public dialog: MatDialog,
  ) { }

  @Input() IdPGeneral = 0;
  @Input() IdPEspecifico = 0;
  @Output() OnRecharge = new EventEmitter<void>();
  public trabajoParesCurso: any;
  public NombreCurso=''
  public RegresarAhora=false;
  public TerminaCarga=false;
  ngOnInit(): void {
    this.RegresarAhora=false
    this.TerminaCarga=false;
    this.ObtenerTrabajoParesPorCursoDocente()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.RegresarAhora=false
    this.TerminaCarga=false;
    if(this.IdPGeneral>0 && this.IdPEspecifico>0){
      this.ObtenerTrabajoParesPorCursoDocente()
    }
  }
  ObtenerTrabajoParesPorCursoDocente(){
    var datePipe = new DatePipe('en-US');
    this._TrabajoDeParesIntegraService
      .ObtenerAlumnoTrabajoParesV2(this.IdPEspecifico,this.IdPGeneral)
      .pipe(takeUntil(this.signal$))
      .subscribe({
      next:x=>{
        console.log(x)
        this.trabajoParesCurso=x
        if(this.trabajoParesCurso!=null || this.trabajoParesCurso!=undefined){
          this.NombreCurso=this.trabajoParesCurso[0].programaGeneral
          this.trabajoParesCurso.forEach((e:any) => {
          e.archivo=e.urlArchivo==null?'Sin Archivo':'Descargar'
          e.Acciones=e.calificado==0?'Calificar':'Mostrar'
        });
        }
      }
    });
  }
  AbrirTrabajoPares(index:number){
    console.log(index)
    const dialogRef = this.dialog.open(DocenciaCalificarTrabajoParesModalComponent, {
      data: {
        idTarea:this.trabajoParesCurso[index].id,
      },
      panelClass: 'custom-dialog-docente-trabajo-pares-modal',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      this.ObtenerTrabajoParesPorCursoDocente()
    });
  }
  Regresar(){
    this.RegresarAhora=true;
  }

}
