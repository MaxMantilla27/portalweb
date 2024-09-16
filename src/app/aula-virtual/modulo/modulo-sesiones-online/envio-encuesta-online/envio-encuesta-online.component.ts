import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
@Component({
  selector: 'app-envio-encuesta-online',
  templateUrl: './envio-encuesta-online.component.html',
  styleUrls: ['./envio-encuesta-online.component.scss'],
})
export class EnvioEncuestaOnlineComponent implements OnInit {
  Inicio = false;
  data: any = {
    encuesta: {
      nombre: 'Encuesta de Evaluación',
      titulo: 'Evaluación del Curso',
      descripcion:
        'Por favor, completa esta encuesta para ayudarnos a mejorar.',
      categoria: [
        {
          orden: 1,
          nombreCategoria: 'Categoría 1',
          preguntasEncuesta: [
            {
              ordenMostrar: 1,
              enunciado:
                '¿Cómo califica a la coordinadora en su atención hacia usted?',
              idPreguntaTipo: 1,
            },
            {
              ordenMostrar: 2,
              enunciado: '¿Recomendarías el curso a tus contactos?',
              idPreguntaTipo: 2,
              alternativas: [{ alternativa: 'Sí' }, { alternativa: 'No' }],
            },
            {
              ordenMostrar: 3,
              enunciado:
                '¿Qué características encontraste en la coordinadora que te ayudaron en tu aula virtual?',
              idPreguntaTipo: 3,
              alternativas: [
                { alternativa: 'Amable' },
                { alternativa: 'Servicial' },
                { alternativa: 'Atenta' },
              ],
            },
            {
              ordenMostrar: 4,
              enunciado:
                '¿Qué recomendación darías para que la coordinadora mejore en su atención?',
              idPreguntaTipo: 4,
              alternativas: [{ alternativa: 'Ingrese su respuesta' },
                
              ],
            },
          ],
        },
        // {
        //   orden: 2,
        //   nombreCategoria: 'Categoria 2',
        //   preguntasEncuesta: [
        //     {
        //       ordenMostrar: 1,
        //       enunciado:
        //         '¿Cómo califica a la coordinadora en su atención hacia usted?',
        //       idPreguntaTipo: 1,
        //     },
        //     {
        //       ordenMostrar: 2,
        //       enunciado: '¿Recomendarías el curso a tus contactos?',
        //       idPreguntaTipo: 2,
        //       alternativas: [{ alternativa: 'Sí' }, { alternativa: 'No' }],
        //     },
        //     {
        //       ordenMostrar: 3,
        //       enunciado:
        //         '¿Qué características encontraste en la coordinadora que te ayudaron en tu aula virtual?',
        //       idPreguntaTipo: 3,
        //       alternativas: [
        //         { alternativa: 'Amable' },
        //         { alternativa: 'Servicial' },
        //         { alternativa: 'Atenta' },
        //       ],
        //     },
        //     {
        //       ordenMostrar: 4,
        //       enunciado:
        //         '¿Qué recomendación darías para que la coordinadora mejore en su atención?',
        //       idPreguntaTipo: 4,
        //       alternativas: [{ alternativa: 'Ingrese su respuesta' }],
        //     },
        //   ],
        // },
      ],
    },

    EncuestaEnviada: false,
  };

  EncuestaAvance = {
    id: 123,
    valores: [
      { IdPregunta: 1, valorRespues: [] },
      { IdPregunta: 2, valorRespues: [] },
      { IdPregunta: 3, valorRespues: [] },
      { IdPregunta: 4, valorRespues: [] },
    ],
    Inicio: false,
  };

  constructor(public dialogRef: MatDialogRef<EnvioEncuestaOnlineComponent>) {}

  ngOnInit(): void {}
  IniciarEncuesta() {
    this.EncuestaAvance.Inicio = true;
  }
  changeRadio(indexCategoria: number, indexPregunta: number, index: number) {
    if (this.data.EncuestaEnviada !== true) {
      this.data.encuesta.categoria[indexCategoria].preguntasEncuesta[
        indexPregunta
      ].alternativas.forEach((a: any) => {
        a.select = false;
      });
      this.data.encuesta.categoria[indexCategoria].preguntasEncuesta[
        indexPregunta
      ].alternativas[index].select = true;
      this.AddToAvance();
    }
  }

  changeCheck(indexCategoria: number, indexPregunta: number, index: number) {
    if (this.data.EncuestaEnviada !== true) {
      this.data.encuesta.categoria[indexCategoria].preguntasEncuesta[
        indexPregunta
      ].alternativas[index].select =
        !this.data.encuesta.categoria[indexCategoria].preguntasEncuesta[
          indexPregunta
        ].alternativas[index].select;
      this.AddToAvance();
    }
  }

  AddToAvance() {
    this.EncuestaAvance.valores.forEach((av: any) => {
      av.valorRespues = [];
    });

    this.data.encuesta.preguntasEncuesta.forEach((p: any) => {
      this.EncuestaAvance.valores.forEach((av: any) => {
        if (av.IdPregunta === p.ordenMostrar) {
          if (p.idPreguntaTipo === 5) {
            av.valorRespues.push(p.respuesta ? p.respuesta[0] : ''); // Asume respuesta como texto si idPreguntaTipo es 5
          } else {
            p.alternativas.forEach((a: any) => {
              if (a.select) {
                av.valorRespues.push(a.alternativa);
              }
            });
          }
        }
      });
    });

    // Simulación del almacenamiento en sesión
    sessionStorage.setItem(
      'cuest-' + this.EncuestaAvance.id.toString(),
      btoa(JSON.stringify(this.EncuestaAvance))
    );
  }
  AgregarPEspecificoSesionEncuestaAlumno(valor: boolean) {}
}
