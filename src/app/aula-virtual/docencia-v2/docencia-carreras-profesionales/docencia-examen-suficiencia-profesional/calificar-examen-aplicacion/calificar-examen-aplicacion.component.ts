import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoCarreraExamenService } from 'src/app/Core/Shared/Services/PEspecificoCarreraExamen/pespecifico-carrera-examen.service';
import { CalificarExamenAplicacionDetalleComponent } from './calificar-examen-aplicacion-detalle/calificar-examen-aplicacion-detalle.component';

@Component({
  selector: 'app-calificar-examen-aplicacion',
  templateUrl: './calificar-examen-aplicacion.component.html',
  styleUrls: ['./calificar-examen-aplicacion.component.scss']
})
export class CalificarExamenAplicacionComponent implements OnInit ,OnChanges , OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }


  @Input() IdPespecifico=0
  columnHeader:any = {
    'codigoMatricula': 'Código',
    'alumno': 'Apellidos y Nombres',
    'fechaEntrega': 'Fecha Entrega',
    'fechaCalificacion': 'Fecha Revisión',
    'nota': 'Nota',
    'Acciones': 'Acciones',
  };

  TipoContenido: any = {
    fechaEntrega: ['date',],
    fechaCalificacion: ['date'],
    'Acciones': ['buttons2', 'fechaCalificacion', ['Disabled','ValorBoton']],
    // 'Nota': ['buttons', 'fechaCalificacion'],
    //'Acciones': ['buttons'],
  };
  public cuestionario: any;
  public cargando=false
  ngOnInit(): void {
  }

  constructor(
    private _PEspecificoCarreraExamenService: PEspecificoCarreraExamenService,
    public dialog: MatDialog,
    ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPespecifico != 0) {
      this.ObtenerMatriculaAlumnoCarreraExamen();
    }
  }
  ObtenerMatriculaAlumnoCarreraExamen(){
    this.cargando=false
    this.cuestionario=[]
    this._PEspecificoCarreraExamenService.ObtenerMatriculaAlumnoCarreraExamen(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.cuestionario=[]
        this.cuestionario=x

        if(this.cuestionario!=null && this.cuestionario.length>0){
          this.cuestionario.forEach(
            (x: any) => {
              x.Acciones=x.fechaCalificacion==null?'Calificar':'Ver Cuestionario',
              x.Disabled=x.id==null?'true':'false',
              x.ValorBoton=x.fechaCalificacion==null?'Calificar':'Ver Cuestionario',
              x.nota=x.nota==null?'Pendiente': x.nota.toString()

            })
        }
        console.log(this.cuestionario)
        this.cargando=true
      },
    });
  }
  Open(e:any){
    console.log(e)
    console.log(this.cuestionario[e])
    const dialogRef = this.dialog.open(CalificarExamenAplicacionDetalleComponent, {
      width: '1200px',
      data:this.cuestionario[e],
      panelClass: 'dialog-detalle-examen',
     disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.ObtenerMatriculaAlumnoCarreraExamen()
      }
    });
  }
}
