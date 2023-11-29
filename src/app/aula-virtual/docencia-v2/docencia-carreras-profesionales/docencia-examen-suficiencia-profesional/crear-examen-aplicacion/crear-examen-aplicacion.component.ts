import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoCarreraExamenService } from 'src/app/Core/Shared/Services/PEspecificoCarreraExamen/pespecifico-carrera-examen.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ModalExamenAplicacionComponent } from './modal-examen-aplicacion/modal-examen-aplicacion.component';
import { ModalPrevisualizacionExamenAplicacionComponent } from './modal-previsualizacion-examen-aplicacion/modal-previsualizacion-examen-aplicacion.component';

@Component({
  selector: 'app-crear-examen-aplicacion',
  templateUrl: './crear-examen-aplicacion.component.html',
  styleUrls: ['./crear-examen-aplicacion.component.scss']
})
export class CrearExamenAplicacionComponent implements OnInit ,OnChanges ,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _PEspecificoCarreraExamenService: PEspecificoCarreraExamenService,
    public dialog: MatDialog,
    private alertaService: AlertaService,
    public _SnackBarServiceService: SnackBarServiceService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdPespecifico)
    if(this.IdPespecifico>0){
      this.ObtenerPEspecificoCarreraExamenPorIdPespecifico()

    }
  }
  @Input() IdPespecifico=0
  public aplicacion:any
  public cargando=false
  ngOnInit(): void {
  }

  ObtenerPEspecificoCarreraExamenPorIdPespecifico(){
    this.aplicacion=undefined
    this.cargando=true
    this._PEspecificoCarreraExamenService.ObtenerPEspecificoCarreraExamenPorIdPespecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.aplicacion=x
        this.cargando=false
      },
    });
  }
  OpenAgregar(){
    const dialogRef = this.dialog.open(ModalExamenAplicacionComponent, {
      width: '1200px',
      data: {id:0 ,idPEspecifico:this.IdPespecifico},
      panelClass: 'dialog-Agregar-examen',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.cargando = true;
        this.ObtenerPEspecificoCarreraExamenPorIdPespecifico()
      }
    });
  }
  OpenEditar(id:number){
    const dialogRef = this.dialog.open(ModalExamenAplicacionComponent, {
      width: '1200px',
      data: {id:id ,idPEspecifico:this.IdPespecifico},
      panelClass: 'dialog-Agregar-examen',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.cargando = true;
        this.ObtenerPEspecificoCarreraExamenPorIdPespecifico()
      }
    });
  }
  PublicarPEspecificoCarreraExamen(detalle:any){
    console.log(detalle)
    const dialogRef = this.dialog.open(ModalPrevisualizacionExamenAplicacionComponent, {
      width: '1000px',
      data: {data:detalle},
      panelClass: 'dialog-Vista-Previa-examen',
      disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      this.cargando = true;
      this.ObtenerPEspecificoCarreraExamenPorIdPespecifico()
      console.log(result)
    });
  }
  EliminarPEspecificoCarreraExamen(id:number){
    console.log(id)
    this.alertaService.mensajeConfirmacionRegistro('El examen sera eliminado. ¿Desea continuar?','').then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoCarreraExamenService.EliminarPEspecificoCarreraExamen(id).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
            this.ObtenerPEspecificoCarreraExamenPorIdPespecifico()
            this._SnackBarServiceService.openSnackBar("El examen se ha eliminado correctamente.",
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
