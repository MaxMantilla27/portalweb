import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PespecificoSesionTemaUpdateOrdenDTO } from 'src/app/Core/Models/PespecificoSesionTemaDTO';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-recursos-tarea',
  templateUrl: './recursos-tarea.component.html',
  styleUrls: ['./recursos-tarea.component.scss']
})
export class RecursosTareaComponent implements OnInit, OnDestroy {

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
    this.OrdenarTarea(this.cuestionarios[event.currentIndex].id,event.currentIndex+1)
  }

  OrdenarTarea(id:number,orden:number) {
    this.Oncharge.emit();
    this.updateOrden.Id=id;
    this.updateOrden.Orden=orden
    this._PEspecificoEsquemaService.OrdenarTarea(this.updateOrden).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.OnReload.emit();
      },
    });
  }
  PublicarTarea(IdTarea:number){
    console.log(IdTarea)
    this.alertaService.mensajeConfirmacionTarea().then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoEsquemaService.PublicarPEspecificoSesionTarea(IdTarea).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
          },
          complete:()=>{
            this.OnReload.emit();
            this._SnackBarServiceService.openSnackBar("La tarea se ha publicado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
          }
        });
      }
    });
  }

}
