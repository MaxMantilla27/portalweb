import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ModalTrabajoAplicacionComponent } from './modal-trabajo-aplicacion/modal-trabajo-aplicacion.component';
import { PEspecificoCarreraTrabajoService } from 'src/app/Core/Shared/Services/PEspecificoCarreraTrabajo/pespecifico-carrera-trabajo.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-crear-trabajo-aplicacion',
  templateUrl: './crear-trabajo-aplicacion.component.html',
  styleUrls: ['./crear-trabajo-aplicacion.component.scss']
})
export class CrearTrabajoAplicacionComponent implements OnInit ,OnChanges ,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _PEspecificoCarreraTrabajoService: PEspecificoCarreraTrabajoService,
    public dialog: MatDialog,
    private alertaService: AlertaService,
    public _SnackBarServiceService: SnackBarServiceService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdPespecifico)
    if(this.IdPespecifico>0){
      this.ObtenerPEspecificoCarreraTrabajoPorIdPespecifico()

    }
  }
  @Input() IdPespecifico=0
  public aplicacion:any
  public cargando=false
  ngOnInit(): void {
  }

  ObtenerPEspecificoCarreraTrabajoPorIdPespecifico(){
    this.cargando=true
    this._PEspecificoCarreraTrabajoService.ObtenerPEspecificoCarreraTrabajoPorIdPespecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.aplicacion=x
        this.cargando=false
      },
    });
  }
  OpenAgregar(){
    const dialogRef = this.dialog.open(ModalTrabajoAplicacionComponent, {
      width: '1200px',
      data: {id:0 ,idPEspecifico:this.IdPespecifico},
      panelClass: 'dialog-Agregar-trabajo',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.cargando = true;
        this.ObtenerPEspecificoCarreraTrabajoPorIdPespecifico()
      }
    });
  }
  OpenEditar(id:number){
    const dialogRef = this.dialog.open(ModalTrabajoAplicacionComponent, {
      width: '1200px',
      data: {id:id ,idPEspecifico:this.IdPespecifico},
      panelClass: 'dialog-Agregar-trabajo',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.cargando = true;
        this.ObtenerPEspecificoCarreraTrabajoPorIdPespecifico()
      }
    });
  }
  PublicarPEspecificoCarreraTrabajo(id:number){
    console.log(id)
    this.alertaService.mensajeConfirmacionRegistro('El trabajo sera publico para los alumnos. ¿Desea continuar?','').then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoCarreraTrabajoService.PublicarPEspecificoCarreraTrabajo(id).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
            this.ObtenerPEspecificoCarreraTrabajoPorIdPespecifico()
            this._SnackBarServiceService.openSnackBar("El trabajo se ha publicado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
          },
          complete:()=>{
          }
        });
      }
    });
  }
  EliminarPEspecificoCarreraTrabajo(id:number){
    console.log(id)
    this.alertaService.mensajeConfirmacionRegistro('El trabajo sera eliminado. ¿Desea continuar?','').then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoCarreraTrabajoService.EliminarPEspecificoCarreraTrabajo(id).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
            this.ObtenerPEspecificoCarreraTrabajoPorIdPespecifico()
            this._SnackBarServiceService.openSnackBar("El trabajo se ha eliminado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
          },
          complete:()=>{
          }
        });
      }
    });
  }
}
