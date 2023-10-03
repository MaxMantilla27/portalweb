import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AgregarCalificacionCuestionarioAlumnoDocenteDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

@Component({
  selector: 'app-vista-previa-cuestionario',
  templateUrl: './vista-previa-cuestionario.component.html',
  styleUrls: ['./vista-previa-cuestionario.component.scss']
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
  public json: AgregarCalificacionCuestionarioAlumnoDocenteDTO = {
    IdPwPEspecificoSesionCuestionarioAlumno: 0,
    Respuestas: [],
    Usuario: 'docente',
  };
  ngOnInit(): void {
    console.log(this.data);

  }
  ObtenerActividadesRecursoSesionAlumnoPorIds() {
    this.cargando=true
    this._PEspecificoEsquemaService
      .ObtenerDetalleCuestionarioVistaPrevia(
        this.data.id
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

}
