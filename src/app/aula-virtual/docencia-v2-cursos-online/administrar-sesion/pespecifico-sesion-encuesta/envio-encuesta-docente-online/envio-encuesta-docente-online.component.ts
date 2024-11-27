import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject,takeUntil } from 'rxjs';
import { EnvioEncuestaDocenteOnlineService } from 'src/app/Core/Shared/Services/EnvioEncuestaDocenteOnline/envio-encuesta-docente-online.service';


interface EncuestaAvancePreguntaRespuestaDTO{
  idRespuesta:number
  respuesta:string,
  puntaje:number
}

interface EncuestaAvanceCategoriaDTO{
  idCategoria: number;
  nombreCategoria: string;
  preguntas: Array<EncuestaAvancePreguntaDTO>;
}

interface EncuestaAvanceDocenteDTO {
  id: number;
  idProveedor: number;
  inicio: boolean;
  idPEspecificoSesion: number;
  idPGeneral: number;
  idPEspecifico: number;
  categorias: Array<EncuestaAvanceCategoriaDTO>;
}


interface EncuestaAvancePreguntaDTO{
  idPregunta: number;
  pregunta: string;
  idPreguntaEncuestaTipo: number;
  preguntaObligatoria: boolean;
  valorRespuesta: Array<EncuestaAvancePreguntaRespuestaDTO>;
}

@Component({
  selector: 'app-envio-encuesta-docente-online',
  templateUrl: './envio-encuesta-docente-online.component.html',
  styleUrls: ['./envio-encuesta-docente-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioEncuestaDocenteOnlineComponent implements OnInit {
  private signal$ = new Subject();
  constructor(

    public dialogRef: MatDialogRef<EnvioEncuestaDocenteOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,
    public _EnvioEncuestaDocenteOnline: EnvioEncuestaDocenteOnlineService,
  ) { 
    
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  public starsRanking: number[] = [1, 2, 3, 4, 5]
  public hoveredStar: number = 0;
  public EncuestaAvance: EncuestaAvanceDocenteDTO = {
    id: 0,
    inicio: false,
    idProveedor: 0,
    idPEspecificoSesion: 0,
    idPGeneral: 0,
    idPEspecifico: 0,
    categorias: [],
  };

public EncuestaCompleta = false;
public EncuestaEnviada = false;

  ngOnInit(): void {


    setTimeout(() => {
      const modalContent = document.querySelector('.scrollable-content-encuesta');
      if (modalContent) {
        modalContent.scrollTop = 0; // Forzar scroll al inicio
      }
    }, 300);

    //this.data = this.data.data;

    console.log(this.data)

    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.id = this.data.encuesta.idEncuestaSesionPrograma;

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
            if (pregunta.idPreguntaEncuesta === respuesta.idPreguntaEncuesta) {
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

      this.data.encuesta.preguntasEncuesta[
        indexCategoria
      ].preguntas[indexPregunta].alternativas.forEach((a: any) => {
        a.select = false;
      });

      this.data.encuesta.preguntasEncuesta[
        indexCategoria
      ].preguntas[indexPregunta].alternativas[index].select = true;
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

  AddToAvance() {
    if (this.data.EncuestaEnviada !== true) {
      // Inicialización de data de guardado
      this.EncuestaAvance.categorias = [];
      this.EncuestaAvance.inicio = true;
      this.EncuestaAvance.id = this.data.encuesta.idEncuestaSesionPrograma;
      this.EncuestaAvance.idProveedor = this.data.IdProveedor;
      this.EncuestaAvance.idPEspecificoSesion = this.data.IdPEspecificoSesion;
      this.EncuestaAvance.idPGeneral = this.data.Sesion.idPGeneralHijo;
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
          const preguntaObjInicial: EncuestaAvancePreguntaDTO = {
            idPregunta: p.idPreguntaEncuesta,
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
            if (pregunta.valorRespuesta.length === 0 || pregunta.valorRespuesta[0].respuesta === '' || pregunta.valorRespuesta[0].respuesta === '0')
            {
              this.EncuestaCompleta = false;
            }
          }
        });
      }
    );
  }

  AgregarPEspecificoSesionEncuestaDocente(valor: Boolean){

    if (this.EncuestaAvance.categorias.length==0) {
        this.AddToAvance();
    }

    console.log(this.EncuestaAvance)

    this._EnvioEncuestaDocenteOnline
      .AgregarPEspecificoSesionEncuestaDocente(this.EncuestaAvance)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.dialogRef.close('guardado');
        },
        complete: () => {},
      });

  }
}
