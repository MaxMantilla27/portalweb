import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { DetallesCuestionarioComponent } from './detalles-cuestionario/detalles-cuestionario.component';

@Component({
  selector: 'app-calificar-cuestionario-docente',
  templateUrl: './calificar-cuestionario-docente.component.html',
  styleUrls: ['./calificar-cuestionario-docente.component.scss']
})
export class CalificarCuestionarioDocenteComponent implements OnInit ,OnChanges , OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() Id = 0;
  @Input() data:any;
  cargando=false
  @Output()
  Volver = new EventEmitter<void>();

  columnHeader:any = {
    codigoMatricula: 'Código',
    nombreAlumno: 'Apellidos y Nombres',
    fechaEntrega: 'Fecha Entrega',
    fechaCalificacion: 'Fecha Revisión',
    nota: 'Nota',
    Acciones: 'Acciones',
  };

  TipoContenido: any = {
    fechaEntrega: ['date'],
    fechaCalificacion: ['date'],
    Acciones: ['buttons', 'Ver Cuestionario'],
    //'Acciones': ['buttons'],
  };
  public cuestionario: any;
  constructor(
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public dialog: MatDialog,
    ) { }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.Id)
    if (this.Id != 0) {
      this.cargando=true
      this.ObtenerListaCuestionarioAlumnoOnline();
    }
  }
  ObtenerListaCuestionarioAlumnoOnline(){
    this.cuestionario=[]
    this._PEspecificoEsquemaService.ObtenerListaCuestionarioAlumnoOnline(this.Id).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x==null){
          this.cuestionario=[]
        }
        this.cuestionario=x
        this.cuestionario.forEach(
          (x: any) => {
            x.idCuestionario=this.Id
          })
        console.log(this.cuestionario)
        this.cargando=false
      },
    });
  }
  Open(e:any){
    console.log(e)
    console.log(this.cuestionario[e])
    const dialogRef = this.dialog.open(DetallesCuestionarioComponent, {
      width: '1200px',
      data:this.cuestionario[e],
      panelClass: 'dialog-detalle-cuestionario',
     disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.cargando = true;
        this.ObtenerListaCuestionarioAlumnoOnline()
      }
    });
  }
}
