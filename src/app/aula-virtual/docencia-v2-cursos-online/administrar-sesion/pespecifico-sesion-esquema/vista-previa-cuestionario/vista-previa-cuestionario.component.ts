import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AgregarCalificacionCuestionarioAlumnoDocenteDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { ImagenModalComponent } from 'src/app/Core/Shared/Containers/Dialog/imagen-modal/imagen-modal.component';


@Component({
  selector: 'app-vista-previa-cuestionario',
  templateUrl: './vista-previa-cuestionario.component.html',
  styleUrls: ['./vista-previa-cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VistaPreviaCuestionarioComponent implements OnInit {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<VistaPreviaCuestionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService,
    public dialog: MatDialog,

  ) { }
  public cargando=false;
  public preguntas: any;
  public respuestas: any;
  public fechacalificacion: any;
  public detalleCuestionario:any;
  public json: AgregarCalificacionCuestionarioAlumnoDocenteDTO = {
    IdPwPEspecificoSesionCuestionarioAlumno: 0,
    Respuestas: [],
    Usuario: 'docente',
  };
  public disabledPublicar=false;
  ngOnInit(): void {
    console.log(this.data);
    this.detalleCuestionario=this.data.data
    console.log(this.detalleCuestionario)
    if(this.detalleCuestionario.publicado==1){
      this.disabledPublicar=true;
    }
    this.ObtenerDetalleCuestionarioVistaPrevia(this.detalleCuestionario.id)
    //this.ObtenerPuntajePreguntasPorCuestionario();

  }
  ObtenerPuntajePreguntasPorCuestionario(id:number){
    this._PEspecificoEsquemaService.ObtenerPuntajePreguntasPorCuestionario(id).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x==100){
          this.PublicarCuestionario(id)
        }else{
          this._SnackBarServiceService.openSnackBar("El puntaje de las preguntas del cuestionario deben sumar 100.",
          'x',
          10,
          "snackbarCrucigramaerror")
        }
      },
    });
  }
  ObtenerDetalleCuestionarioVistaPrevia(IdCuestionario:number) {
    this.cargando=true
    this._PEspecificoEsquemaService
      .ObtenerDetalleCuestionarioVistaPrevia(IdCuestionario)
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
  PublicarCuestionario(IdCuestionario:number){
    this.cargando=true
    this.alertaService.mensajeConfirmacionCuestionario().then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoEsquemaService.ResetearCuestionarioAlumno(IdCuestionario).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
          },
          complete:()=>{
            this.dialogRef.close();
            this._SnackBarServiceService.openSnackBar("El cuestionario se ha publicado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
          }
        });
      }
    });
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
  // changeRadio(indexPregunta:number,index:number){
  //   this.preguntas.alternativas.forEach((a:any) => {
  //     a.select=false
  //   });
  //   this.preguntas[indexPregunta].alternativas[index].select=true
  // }
  // changeCheck(indexPregunta:number,index:number){
  //   this.preguntas.alternativas[index].select=!this.preguntas[indexPregunta].alternativas[index].select

  // }

}
