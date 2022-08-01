import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ReporteParticipacionExpositorService } from 'src/app/Core/Shared/Services/ReporteParticipacionExpositor/reporte-participacion-expositor.service';
import { DocenciaGestionAsistenciasRegistroComponent } from './docencia-gestion-asistencias-registro/docencia-gestion-asistencias-registro.component';

@Component({
  selector: 'app-docencia-gestion-asistencias',
  templateUrl: './docencia-gestion-asistencias.component.html',
  styleUrls: ['./docencia-gestion-asistencias.component.scss']
})
export class DocenciaGestionAsistenciasComponent implements OnInit,OnDestroy,OnChanges {

  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    public _ReporteParticipacionExpositorService: ReporteParticipacionExpositorService,
    public dialog: MatDialog,
  ) { }
  public json: ParticipacionExpositorFiltroDTO = {
    IdArea: null,
    IdCentroCosto: null,
    IdCodigoBSCiudad: null,
    IdEstadoPEspecifico: '1,2,3,5',
    IdModalidadCurso: null,
    IdPGeneral: null,
    IdProgramaEspecifico: null,
    IdProveedorOperaciones: '',
    IdSubArea: null,
    IdCentroCostoD: 0,
    SinNotaAprobada: null,
    SinAsistenciaAprobada:true
  };
  @Input() IdProveedor = 0;
  @Input() IdExpositor = 0;
  @Input() Correo = '';
  public notas: any;
  columnHeader = {
    CentroCostoPrograma: 'Centro de Costo',
    PEspecifico: 'Curso',
    Grupo: 'Grupo',
    EstadoCurso: 'Estado',
    FechaInicio: 'Fecha Inicio',
    FechaTermino: 'Fecha Fin',
    Acciones: 'Acciones',
  };

  TipoContenido: any = {
    FechaInicio: ['date'],
    FechaTermino: ['date'],
    Acciones: ['buttons', 'Asistencia'],
    //'Acciones': ['buttons'],
  };
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdProveedor > 0 /*&& this.IdExpositor>0*/) {
      this.json.IdProveedorOperaciones = this.IdProveedor.toString()
      this.GenerarReporteFiltradoPortal()
    }
  }

  GenerarReporteFiltradoPortal() {
    this._ReporteParticipacionExpositorService
      .GenerarReporteFiltradoPortal(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.notas = x;
          console.log(x);
        },
      });
  }
  OpenNota(index:number){
    console.log(index)
    const dialogRef = this.dialog.open(DocenciaGestionAsistenciasRegistroComponent, {
      width: '1000px',
      data: {grupo:this.notas[index].Grupo,IdPEspecifico:this.notas[index].IdPEspecifico,correo:this.Correo},
      panelClass: 'custom-dialog-docente-asistencia-container',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      this.GenerarReporteFiltradoPortal();
    });
  }
}
