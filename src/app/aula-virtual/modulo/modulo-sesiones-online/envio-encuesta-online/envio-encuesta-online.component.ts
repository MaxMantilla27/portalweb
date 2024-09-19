import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-envio-encuesta-online',
  templateUrl: './envio-encuesta-online.component.html',
  styleUrls: ['./envio-encuesta-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioEncuestaOnlineComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<EnvioEncuestaOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  Inicio = false;
  public starsRanking: number[] = [1, 2, 3, 4, 5]; // Total de estrellas
  public hoveredStar: number = 0; // Valor de estrella sobre la cual se hace hover

  public dataGuardada: any;

  public EncuestaAvance: {
    inicio: boolean;
    categorias: Array<{
      idCategoria: number;
      nombreCategoria: string;
      preguntas: Array<{
        idPregunta: number;
        pregunta: string;
        idPreguntaEncuestaTipo: number; // 1: Selección Única, 2: Selección Múltiple, 3: Casilla de Texto, 4: Ranking
        valorRespues: Array<string | null>;
      }>;
    }>;
    id: number;
  } = {
    inicio: false,
    categorias: [],
    id: 0
  };
  public EncuestaCompleta=false

  ngOnInit(): void {
    console.log(this.data);
    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.id = this.data.encuesta.id;
    // if(this.data.encuesta!=undefined &&
    //   this.data.encuesta.encuesta!=undefined &&
    //   this.data.encuesta.encuesta!=null){
    //     if(this.data.encuesta.respuestasEncuesta!=null &&
    //       this.data.encuesta.respuestasEncuesta!=undefined &&
    //       this.data.encuesta.respuestasEncuesta.length>0){
    // this.dataGuardada=this.data.cuestionario.respuestaCuestionario[0]
    // }
    // }
  }
  IniciarEncuesta() {
    this.EncuestaAvance.inicio = true;
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
    this.hoveredStar = starNumber;
  }

  // Restablece el resaltado cuando el mouse sale
  resetHighlight(): void {
    this.hoveredStar = 0;
  }
  AddToAvance() {
    console.log(this.EncuestaAvance);

    // Inicialización de data de guardado
    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.id = this.data.encuesta.id;

    // Iterar sobre las categorías de preguntas de la encuesta
    this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {
      // Inicializar el objeto para la categoría
      const categoriaObjInicial = {
        idCategoria: categoria.idCategoria,
        nombreCategoria: categoria.nombreCategoria,
        preguntas: [] as Array<{ idPregunta: number, pregunta: string, idPreguntaEncuestaTipo: number, valorRespues: Array<string | null> }>
      };
      this.EncuestaAvance.categorias.push(categoriaObjInicial);

      // Iterar sobre las preguntas dentro de cada categoría
      categoria.preguntas.forEach((p: any) => {
        // Inicializar el objeto de la pregunta
        const preguntaObjInicial = {
          idPregunta: p.id, // Asegurarse de que este es el ID correcto de la pregunta
          pregunta: p.pregunta,
          idPreguntaEncuestaTipo: p.idPreguntaEncuestaTipo,
          valorRespues: [] as Array<string | null> // Arreglo para almacenar respuestas
        };
        categoriaObjInicial.preguntas.push(preguntaObjInicial);

        // Verificar el tipo de pregunta y almacenar las respuestas según corresponda
        if (p.idPreguntaEncuestaTipo === 3) {
          // Para preguntas de tipo "Casilla de Texto"
          const respuesta = p.alternativas?.[0]?.respuesta || '';
          preguntaObjInicial.valorRespues.push(respuesta);

        } else if (p.idPreguntaEncuestaTipo === 1) {
          // Para preguntas de tipo "Selección Única"
          p.alternativas.forEach((a: any) => {
            if (a.select) {
              preguntaObjInicial.valorRespues.push(a.respuesta);
            }
          });

        } else if (p.idPreguntaEncuestaTipo === 2) {
          // Para preguntas de tipo "Selección Múltiple"
          p.alternativas.forEach((a: any) => {
            if (a.select) {
              preguntaObjInicial.valorRespues.push(a.respuesta);
            }
          });

        } else if (p.idPreguntaEncuestaTipo === 4) {
          // Para preguntas de tipo "Ranking"
          const valorRanking = p.valorRanking || 0; // Valor de las estrellas seleccionadas (1 a 5)
          preguntaObjInicial.valorRespues.push(valorRanking.toString()); // Guardar el valor de la selección como string
        }
      });
    });
    this.verificarRespuestasCompletas()
  }
  verificarRespuestasCompletas() {
  this.EncuestaCompleta = true;

  this.EncuestaAvance.categorias.forEach((categoria: any) => {
    categoria.preguntas.forEach((pregunta: any) => {
      if (pregunta.valorRespues.length === 0 || pregunta.valorRespues[0] === null || pregunta.valorRespues[0] === '') {
        this.EncuestaCompleta = false;
      }
    });
  });
}

  AgregarPEspecificoSesionEncuestaAlumno(valor: boolean) {
    console.log(this.EncuestaAvance);
  }
}
