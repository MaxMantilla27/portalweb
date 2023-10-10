import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PespecificoSesionTemaUpdateOrdenDTO } from 'src/app/Core/Models/PespecificoSesionTemaDTO';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { VistaPreviaCuestionarioComponent } from '../vista-previa-cuestionario/vista-previa-cuestionario.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recursos-cuestionario',
  templateUrl: './recursos-cuestionario.component.html',
  styleUrls: ['./recursos-cuestionario.component.scss']
})
export class RecursosCuestionarioComponent implements OnInit, OnDestroy {

  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _PEspecificoEsquemaService:PEspecificoEsquemaService,
    public dialog: MatDialog,
  ) { }

  @Input() cuestionarios:Array<any> = [];
  @Output() OnEdit = new EventEmitter<number>();
  @Output() OnDelete = new EventEmitter<number>();
  @Output() OnReload = new EventEmitter<void>();
  @Output() Oncharge = new EventEmitter<void>();

  public updateOrden:PespecificoSesionTemaUpdateOrdenDTO={
    Id:0,
    Orden:0,
  }
  public data:any;
  public sesion:any;

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    moveItemInArray(this.cuestionarios, event.previousIndex, event.currentIndex);
    this.OrdenarCuestionario(this.cuestionarios[event.currentIndex].id,event.currentIndex+1)
  }

  OrdenarCuestionario(id:number,orden:number) {
    this.Oncharge.emit();
    this.updateOrden.Id=id;
    this.updateOrden.Orden=orden
    this._PEspecificoEsquemaService.OrdenarCuestionario(this.updateOrden).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.OnReload.emit();
      },
    });
  }
  OpenVistaPrevia(detalle:any){
    console.log(detalle)
    const dialogRef = this.dialog.open(VistaPreviaCuestionarioComponent, {
      width: '1000px',
      data: {data:detalle},
      panelClass: 'dialog-Vista-Previa-Cuestionario',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        // this.charge = true;
        // this.ObtenerActividadesRecursoSesionDocente()
      }
    });
  }
  // PublicarCuestionario(detalle:any){
  //   console.log(detalle)
  // }
}
