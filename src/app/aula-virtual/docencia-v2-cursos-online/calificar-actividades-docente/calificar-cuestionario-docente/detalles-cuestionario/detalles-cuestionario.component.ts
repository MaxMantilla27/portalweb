import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AgregarCalificacionCuestionarioAlumnoDocenteDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-detalles-cuestionario',
  templateUrl: './detalles-cuestionario.component.html',
  styleUrls: ['./detalles-cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallesCuestionarioComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<DetallesCuestionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    private _SnackBarServiceService: SnackBarServiceService
  ) {}
  public preguntas: any;
  public respuestas: any;
  public nota = 0;
  public fechacalificacion: any;
  public json: AgregarCalificacionCuestionarioAlumnoDocenteDTO = {
    IdPwPEspecificoSesionCuestionarioAlumno: 0,
    Respuestas: [],
    Usuario: 'docente',
  };
  cargando=false
  ngOnInit(): void {
    console.log(this.data);
    this.nota = this.data.nota;
    this.ObtenerActividadesRecursoSesionAlumnoPorIds();
  }
  ObtenerActividadesRecursoSesionAlumnoPorIds() {
    this.cargando=true
    this._PEspecificoEsquemaService
      .ObtenerActividadesRecursoSesionAlumnoPorIds(
        this.data.idCuestionario,
        this.data.idMatriculaCabecera
      )
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.preguntas = x.preguntas;
          this.respuestas = x.respuestas;
          if (this.respuestas != null && this.respuestas.length > 0) {
            this.fechacalificacion = this.respuestas[0].fechaCalificacion;
            this.json.IdPwPEspecificoSesionCuestionarioAlumno =
              this.respuestas[0].id;
            this.preguntas.forEach((p: any) => {
              this.respuestas[0].respuestas.forEach((r: any) => {
                if (r.idPwPEspecificoSesionCuestionarioPregunta == p.id) {
                  if (p.idPreguntaTipo == 6) {
                    p.respuesta = [r.id,r.valor];
                    var maxPuntos = 0;
                    p.alternativas.forEach((a: any) => {
                      maxPuntos = a.puntaje;
                      if (r.valor.toString() == a.id.toString()) {
                        a.Correcto = r.correcto;
                      }
                    });
                    p.data = [];
                    for (let index = 0; index <= maxPuntos; index=index+5) {
                      p.data.push(index);
                    }
                    if (maxPuntos%5!=0){
                      p.data.push(maxPuntos)
                    }
                    // for (let index = 0; index < maxPuntos; index++) {
                    //   p.data.push(index + 1 );
                    // }
                    p.valueSelec = null;
                  } else {
                    p.alternativas.forEach((a: any) => {
                      if (r.valor.toString() == a.id.toString()) {
                        a.select = true;
                        a.Correcto = r.correcto;
                      }
                    });
                  }
                }
              });
            });
            this.preguntas.forEach((p: any) => {
              p.FinalCorecto = false;
              p.puntos = 0;
              if (p.idPreguntaTipo == 6) {
                this.respuestas[0].respuestas.forEach((r: any) => {
                  if (r.idPwPEspecificoSesionCuestionarioPregunta == p.id) {
                    p.puntos=r.puntos,
                    p.FinalCorecto = r.correcto;
                  }
                });
              } else {
                var conparacion = true;
                p.alternativas.forEach((a: any) => {
                  var corect = a.Correcto == undefined ? false : a.Correcto;
                  if (corect != a.esCorrecta) {
                    conparacion = false;
                  }
                });
                p.FinalCorecto = conparacion;
              }
              p.alternativas.forEach((a: any) => {
                if (a.Correcto == true) {
                  p.puntos += a.puntaje;
                }
              });
            });
          }
          this.cargando=false
          console.log(this.preguntas);
        },
      });
  }
  SetNota(item: any) {
    console.log(item);
    this.nota = this.data.nota;

    this.preguntas.forEach((p: any) => {
      if (p.idPreguntaTipo == 6) {
        if (p.valueSelec != null) {
          this.nota+=p.valueSelec*1
        }
      }
    })
  }
  AgregarCalificacionCuestionarioAlumnoDocente() {
    this.cargando=true
    var erro = 0;
    this.json.Respuestas = [];
    this.preguntas.forEach((p: any) => {
      if (p.idPreguntaTipo == 6) {
        if (p.valueSelec != null) {
          this.json.Respuestas.push({
            Id: p.respuesta[0],
            Puntos: p.valueSelec,
            Correcto:
              p.data[p.data.length - 1].toString() == p.valueSelec.toString()
                ? true
                : false,
          });
        } else {
          erro++;
        }
      }
    });
    if (erro > 0) {
      this._SnackBarServiceService.openSnackBar(
        'Es necesario que califique todas las preguntas manuales',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
      this.cargando=false
    } else {
      this._PEspecificoEsquemaService
        .AgregarCalificacionCuestionarioAlumnoDocente(this.json)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            console.log(x);

            this._SnackBarServiceService.openSnackBar(
              'Se califico correctamente',
              'x',
              10,
              'snackbarCrucigramaSucces'
            );
            this.cargando=false
            this.dialogRef.close("guardado")
          },
        });
    }
  }
}
