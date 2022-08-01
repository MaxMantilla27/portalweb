import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ReporteParticipacionExpositorService } from 'src/app/Core/Shared/Services/ReporteParticipacionExpositor/reporte-participacion-expositor.service';
import { DocenciaGestionSilabosRegistroComponent } from './docencia-gestion-silabos-registro/docencia-gestion-silabos-registro.component';

@Component({
  selector: 'app-docencia-gestion-silabos',
  templateUrl: './docencia-gestion-silabos.component.html',
  styleUrls: ['./docencia-gestion-silabos.component.scss']
})
export class DocenciaGestionSilabosComponent implements OnInit,OnChanges,OnDestroy {

  constructor(
    public _ReporteParticipacionExpositorService: ReporteParticipacionExpositorService,
    public dialog: MatDialog
  ) { }
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() IdProveedor = 0;
  @Input() IdExpositor = 0;
  @Input() Correo = '';
  @Input() notas: any;
  @Output() OnRecharge = new EventEmitter<void>();
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
    Acciones: ['buttons', 'Gestionar'],
    //'Acciones': ['buttons'],
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdProveedor > 0 /*&& this.IdExpositor>0*/) {
      // this.json.IdProveedorOperaciones = this.IdProveedor.toString()
      // this.GenerarReporteFiltradoPortal()
    }
  }
  ngOnInit(): void {
  }
  OpenNota(index:number){
    console.log(index)
    const dialogRef = this.dialog.open(DocenciaGestionSilabosRegistroComponent, {
      width: '1000px',
      data: {grupo:this.notas[index].Grupo,IdPEspecifico:this.notas[index].IdPEspecifico,correo:this.Correo,idProveedor:this.IdProveedor},
      panelClass: 'custom-dialog-docente-silabo-container',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      this.OnRecharge.emit();
      //this.GenerarReporteFiltradoPortal();
    });
  }
}
