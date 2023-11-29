import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ImagenModalComponent } from 'src/app/Core/Shared/Containers/Dialog/imagen-modal/imagen-modal.component';
import { PEspecificoCarreraExamenService } from 'src/app/Core/Shared/Services/PEspecificoCarreraExamen/pespecifico-carrera-examen.service';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-modal-previsualizacion-examen-aplicacion',
  templateUrl: './modal-previsualizacion-examen-aplicacion.component.html',
  styleUrls: ['./modal-previsualizacion-examen-aplicacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalPrevisualizacionExamenAplicacionComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<ModalPrevisualizacionExamenAplicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoCarreraExamenService: PEspecificoCarreraExamenService,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService,
    public dialog: MatDialog,

  ) { }
  public cargando=false;
  public preguntas: any;
  public respuestas: any;
  public fechacalificacion: any;
  public detalleExamen:any;
  public disabledPublicar=false;

  ngOnInit(): void {
    console.log(this.data);
    this.detalleExamen=this.data.data
    console.log(this.detalleExamen)
    if(this.detalleExamen.publicado==true){
      this.disabledPublicar=true;
    }
    this.ObtenerpreguntasExamen()
  }
  ObtenerpreguntasExamen(){
    this.cargando=true
    this._PEspecificoCarreraExamenService.ObtenerpreguntasExamen(this.detalleExamen.id)
    .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.preguntas = x;
          // this.preguntas.alternativas.forEach((a:any) => {
          //   a.select=false
          // });

        },
      });
  }
  PublicarExamen(){
    this.cargando=true
    if(this.detalleExamen.calificacionMaxima!=this.detalleExamen.cantidad){
      this._SnackBarServiceService.openSnackBar("El puntaje de las preguntas del examen deben sumar "+this.detalleExamen.calificacionMaxima+".",
      'x',
      10,
      "snackbarCrucigramaerror")
    }else{
      this._PEspecificoCarreraExamenService.PublicarPEspecificoCarreraExamen(this.detalleExamen.id).pipe(takeUntil(this.signal$)).subscribe({
        next: (x:any) => {
        },
        complete:()=>{
          this.dialogRef.close();
          this._SnackBarServiceService.openSnackBar("El examen se ha publicado correctamente.",
          'x',
          10,
          "snackbarCrucigramaSucces")
        }
      });
    }
  }
  getUrl(url:string)
  {
    return "url('"+url+"')";
  }
  OpenImage(url:string)
  {
    this.dialog.open(ImagenModalComponent, {
      width: '1000px',
      data: url,
      panelClass: 'dialog-Imagen-Modal'
    });
  }

}
