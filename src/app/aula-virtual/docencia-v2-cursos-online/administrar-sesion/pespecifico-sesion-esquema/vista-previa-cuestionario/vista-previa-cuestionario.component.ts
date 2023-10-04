import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AgregarCalificacionCuestionarioAlumnoDocenteDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

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
  ngOnInit(): void {
    console.log(this.data);
    this.detalleCuestionario=this.data.data
    this.ObtenerDetalleCuestionarioVistaPrevia(this.detalleCuestionario.id)

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
          this.preguntas.alternativas.forEach((a:any) => {
            a.select=false
          });

        },
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