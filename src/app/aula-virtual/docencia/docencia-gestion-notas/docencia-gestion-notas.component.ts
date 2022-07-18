import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { ReporteParticipacionExpositorService } from 'src/app/Core/Shared/Services/ReporteParticipacionExpositor/reporte-participacion-expositor.service';
import { DocenciaGestionNotasRegistroComponent } from './docencia-gestion-notas-registro/docencia-gestion-notas-registro.component';

@Component({
  selector: 'app-docencia-gestion-notas',
  templateUrl: './docencia-gestion-notas.component.html',
  styleUrls: ['./docencia-gestion-notas.component.scss'],
})
export class DocenciaGestionNotasComponent
  implements OnInit, OnChanges, OnDestroy
{
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    public _ReporteParticipacionExpositorService: ReporteParticipacionExpositorService,
    public dialog: MatDialog
  ) {}
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
    SinNotaAprobada: true,
  };
  @Input() IdProveedor = 0;
  @Input() IdExpositor = 0;
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
    Acciones: ['buttons', 'Notas'],
    //'Acciones': ['buttons'],
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdProveedor > 0 /*&& this.IdExpositor>0*/) {
      this.json.IdProveedorOperaciones = this.IdProveedor.toString();
      this.GenerarReporteFiltradoPortal();
    }
  }
  ngOnInit(): void {}
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
    const dialogRef = this.dialog.open(DocenciaGestionNotasRegistroComponent, {
      width: '1000px',
      data: {grupo:this.notas[index].Grupo,IdPEspecifico:this.notas[index].IdPEspecifico},
      panelClass: 'custom-dialog-docente-nota-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
