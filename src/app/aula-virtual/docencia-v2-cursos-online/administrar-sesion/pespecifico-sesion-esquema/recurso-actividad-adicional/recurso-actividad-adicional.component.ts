import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PespecificoSesionTemaUpdateOrdenDTO } from 'src/app/Core/Models/PespecificoSesionTemaDTO';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-recurso-actividad-adicional',
  templateUrl: './recurso-actividad-adicional.component.html',
  styleUrls: ['./recurso-actividad-adicional.component.scss']
})
export class RecursoActividadAdicionalComponent implements OnInit, OnDestroy {

  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _PEspecificoEsquemaService:PEspecificoEsquemaService,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService,
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
  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    moveItemInArray(this.cuestionarios, event.previousIndex, event.currentIndex);
    this.OrdenarActividad(this.cuestionarios[event.currentIndex].id,event.currentIndex+1)
  }

  OrdenarActividad(id:number,orden:number) {
    this.Oncharge.emit();
    this.updateOrden.Id=id;
    this.updateOrden.Orden=orden
    this._PEspecificoEsquemaService.OrdenarActividad(this.updateOrden).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.OnReload.emit();
      },
    });
  }
  PublicarActividad(IdActividad:number){
    this.alertaService.mensajeConfirmacionActividad().then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoEsquemaService.PublicarPEspecificoSesionActividad(IdActividad).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
          },
          complete:()=>{
            this.OnReload.emit();
            this._SnackBarServiceService.openSnackBar("La actividad se ha publicado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
          }
        });
      }
    });
  }

}
