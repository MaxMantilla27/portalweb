import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray} 
from '@angular/cdk/drag-drop';
import { Subject, takeUntil, timer } from 'rxjs';
import {
  EncuestaAvanceCategoriaDTO,
  EncuestaAvanceDTO,
  EncuestaAvancePreguntaDTO,
  EncuestaAvancePreguntaRespuestaDTO,
} from 'src/app/Core/Models/PEspecificoEsquema';
import { ChargeSpinnerComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-spinner/charge-spinner.component';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
@Component({
  selector: 'app-envio-encuesta-online',
  templateUrl: './envio-encuesta-online.component.html',
  styleUrls: ['./envio-encuesta-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioEncuestaOnlineComponent implements OnInit  {
  private signal$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<EnvioEncuestaOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    //private cdr: ChangeDetectorRef
    private appRef: ApplicationRef
  ) {}



  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public starsRanking: number[] = [1, 2, 3, 4, 5]; // Total de estrellas
  public hoveredStar: number = 0; // Valor de estrella sobre la cual se hace hover
  public EncuestaAvance: EncuestaAvanceDTO = {
    id: 0,
    inicio: false,
    idMatriculaCabecera: 0,
    idPEspecificoSesion: 0,
    idPGeneral: 0,
    idPEspecifico: 0,
    categorias: [],
  };
  public EncuestaCompleta = false;
  public EncuestaEnviada = false;
  public ListaJerarquico: string[] = []

  ngOnInit(): void {

    setTimeout(() => {
      const modalContent = document.querySelector('.mat-dialog-content');
      if (modalContent) {
        modalContent.scrollTop = 0; // Forzar scroll al inicio
      }
    }, 0);

    console.log(this.data);
    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.id = this.data.encuesta.id;

    if (this.data.encuesta && this.data.encuesta.preguntasEncuesta) {
      if(this.data.encuesta.respuestasEncuesta.length!=0){
        const respuestasEncuesta = this.data.encuesta.respuestasEncuesta[0].respuestas;
      this.EncuestaEnviada = true;
      this.data.EncuestaEnviada = this.EncuestaEnviada;
      this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {

        categoria.preguntas.forEach((pregunta: any) => {
          if (pregunta.idPreguntaEncuestaTipo==3 ||pregunta.idPreguntaEncuestaTipo==4) {
            pregunta.alternativas = [{ respuesta: '' }];
          }
          pregunta.respuesta = [];
          let vaRes: Array<any> = [];
          
          respuestasEncuesta.forEach((respuesta: any) => {
            console.log(respuesta);
            if (pregunta.id === respuesta.idPreguntaEncuesta) {
              // Casilla de texto
              if (pregunta.idPreguntaEncuestaTipo === 3) {
                pregunta.alternativas[0].respuesta = [respuesta.valor];
              }
              // Selección Múltiple
              else if (pregunta.idPreguntaEncuestaTipo === 2) {
                vaRes.push(respuesta.valor);
                pregunta.alternativas.forEach((alternativa: any) => {
                  if (alternativa.id.toString() === respuesta.valor) {
                    alternativa.select = true;
                  }
                });
              }
              // Selección Única
              else if (pregunta.idPreguntaEncuestaTipo === 1) {
                pregunta.alternativas.forEach((alternativa: any) => {
                  if (alternativa.id.toString() === respuesta.valor) {
                    alternativa.select = true;
                  }
                });
              }
              // Ranking (puede requerir un tratamiento especial si hay una lógica adicional)
              else if (pregunta.idPreguntaEncuestaTipo === 4) {
                pregunta.valorRanking = [respuesta.valor]; // Asume que el valor es un número de ranking
              }
              else if (pregunta.idPreguntaEncuestaTipo==5 ) {
                 
                 pregunta.alternativas.forEach((alternativa:any,index:any)=>{

                  if (alternativa.orden == respuesta.puntos) {
                    return alternativa.respuesta = respuesta.valor;
                  }   
                 })
              }

            }
          });
        });
      });
      }
      else {
        this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {
          categoria.preguntas.forEach((pregunta: any) => {
            if (pregunta.idPreguntaEncuestaTipo==3 ||pregunta.idPreguntaEncuestaTipo==4) {
              pregunta.alternativas = [{ respuesta: '' }];
            }

          })

        })
      }
    } else {
      console.log('No se encontraron preguntas en la encuesta.');
    }
    this.verificarRespuestasCompletas()
  }

  changeRadio(indexCategoria: number, indexPregunta: number, index: number) {
    if (this.data.EncuestaEnviada !== true) {
      this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
        indexPregunta
      ].alternativas.forEach((a: any) => {
        a.select = false;
      });
      this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
        indexPregunta
      ].alternativas[index].select = true;
      this.AddToAvance();
    }
  }

  changeCheck(indexCategoria: number, indexPregunta: number, index: number) {
    if (this.data.EncuestaEnviada !== true) {
      this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
        indexPregunta
      ].alternativas[index].select =
        !this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
          indexPregunta
        ].alternativas[index].select;
      this.AddToAvance();
    }
  }
  // Resalta las estrellas cuando el mouse pasa sobre ellas
  highlightStars(starNumber: number): void {
    if (this.data.EncuestaEnviada !== true) {
      this.hoveredStar = starNumber;
    }
  }

  // Restablece el resaltado cuando el mouse sale
  resetHighlight(): void {
    if (this.data.EncuestaEnviada !== true) {
      this.hoveredStar = 0;
    }
  }

  // Cambiamos el tipo del array de string[] a un array de objetos
  drop(evento: CdkDragDrop<any>) {
    moveItemInArray(evento.container.data,evento.previousIndex, evento.currentIndex);
  }

  AddToAvance() {
    if (this.data.EncuestaEnviada !== true) {
      // Inicialización de data de guardado
      this.EncuestaAvance.categorias = [];
      this.EncuestaAvance.inicio = true;
      this.EncuestaAvance.id = this.data.encuesta.id;
      this.EncuestaAvance.idMatriculaCabecera = this.data.IdMatriculaCabecera;
      this.EncuestaAvance.idPEspecificoSesion = this.data.IdPEspecificoSesion;
      this.EncuestaAvance.idPGeneral = this.data.IdPGeneral;
      this.EncuestaAvance.idPEspecifico = this.data.IdPEspecifico;

      // Iterar sobre las categorías de preguntas de la encuesta
      this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {
        const categoriaObjInicial: EncuestaAvanceCategoriaDTO = {
          idCategoria: categoria.idCategoria,
          nombreCategoria: categoria.nombreCategoria,
          preguntas: [],
        };
        this.EncuestaAvance.categorias.push(categoriaObjInicial);

        categoria.preguntas.forEach((p: any) => {
          console.log(p)
          const preguntaObjInicial: EncuestaAvancePreguntaDTO = {
            idPregunta: p.id,
            pregunta: p.pregunta,
            idPreguntaEncuestaTipo: p.idPreguntaEncuestaTipo,
            preguntaObligatoria:p.preguntaObligatoria,
            valorRespuesta: [],
          };
          categoriaObjInicial.preguntas.push(preguntaObjInicial);

          if (p.idPreguntaEncuestaTipo === 3) {
            const respuesta = p.alternativas?.[0]?.respuesta || '';
            const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
              idRespuesta: 0,
              puntaje: 0,
              respuesta: respuesta,
            }; // Usar recpuesta como número
            preguntaObjInicial.valorRespuesta.push(respuestaObj);
          } else if (p.idPreguntaEncuestaTipo === 1) {
            p.alternativas.forEach((a: any) => {
              if (a.select) {
                const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
                  idRespuesta: a.id,
                  puntaje: a.puntaje,
                  respuesta: a.id.toString(),
                };
                preguntaObjInicial.valorRespuesta.push(respuestaObj);
              }
            });
          } else if (p.idPreguntaEncuestaTipo === 2) {
            p.alternativas.forEach((a: any) => {
              if (a.select) {
                const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
                  idRespuesta: a.id,
                  puntaje: a.puntaje,
                  respuesta: a.id.toString(),
                };
                preguntaObjInicial.valorRespuesta.push(respuestaObj);
              }
            });
          } else if (p.idPreguntaEncuestaTipo === 4) {
            const valorRanking = p.valorRanking || 0;
            const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
              idRespuesta: 0,
              puntaje: valorRanking,
              respuesta: valorRanking.toString(),
            }; // Guardar ranking como número
            preguntaObjInicial.valorRespuesta.push(respuestaObj);
          } else if (p.idPreguntaEncuestaTipo===5) {
            let c=1;
            p.alternativas.forEach((a: any) => {
              
              if (a) {
                const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
                  idRespuesta: a.id,
                  puntaje: c,
                  respuesta: a.respuesta
                };
                preguntaObjInicial.valorRespuesta.push(respuestaObj);
              }
              c++
            });

          }


        });
      });
      this.verificarRespuestasCompletas();
    }
  }

  verificarRespuestasCompletas() {
    this.EncuestaCompleta = true;
    if(this.EncuestaAvance.categorias.length==0){
      this.AddToAvance()
    }
    this.EncuestaAvance.categorias.forEach(
      (categoria: EncuestaAvanceCategoriaDTO) => {
        categoria.preguntas.forEach((pregunta: EncuestaAvancePreguntaDTO) => {
          if(pregunta.preguntaObligatoria){
            if (pregunta.valorRespuesta.length === 0 || pregunta.valorRespuesta[0].respuesta === '')
            {
              this.EncuestaCompleta = false;
            }
          }
        });
      }
    );
  }

  AgregarPEspecificoSesionEncuestaAlumno(valor: boolean) {
    if(this.EncuestaAvance.categorias.length==0){
      this.AddToAvance()
    }
    this._PEspecificoEsquemaService
      .AgregarPEspecificoSesionEncuestaAlumno(this.EncuestaAvance)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.dialogRef.close('guardado');
        },
        complete: () => {},
      });
  }
}
