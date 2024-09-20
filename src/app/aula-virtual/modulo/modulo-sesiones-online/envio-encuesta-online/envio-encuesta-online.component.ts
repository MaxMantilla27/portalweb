import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { EncuestaAvanceCategoriaDTO, EncuestaAvanceDTO, EncuestaAvancePreguntaDTO, EncuestaAvancePreguntaRespuestaDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
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
    public dialog: MatDialog,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,

  ) {}

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  Inicio = false;
  public starsRanking: number[] = [1, 2, 3, 4, 5]; // Total de estrellas
  public hoveredStar: number = 0; // Valor de estrella sobre la cual se hace hover

  public dataGuardada: any;

  public EncuestaAvance: EncuestaAvanceDTO = {
    id: 0,
    inicio: false,
    idMatriculaCabecera:0,
    idPEspecificoSesion:0,
    idPGeneral:0,
    idPEspecifico:0,
    categorias: [],
  };
  public EncuestaCompleta=false

  ngOnInit(): void {
    console.log(this.data);
    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.id = this.data.encuesta.id;
    if(this.data.encuesta!=undefined &&
      this.data.encuesta.encuesta!=undefined &&
      this.data.encuesta.encuesta!=null){
      if(this.data.encuesta.respuestasEncuesta!=null &&
        this.data.encuesta.respuestasEncuesta!=undefined &&
        this.data.encuesta.respuestasEncuesta.length>0){
      this.dataGuardada=this.data.cuestionario.respuestaCuestionario[0]
      }
      else{

      }
    }
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
    // Inicialización de data de guardado
    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.id = this.data.encuesta.id;
    this.EncuestaAvance.idMatriculaCabecera = this.data.IdMatriculaCabecera;
    this.EncuestaAvance.idPEspecificoSesion =this.data.IdPEspecificoSesion;
    this.EncuestaAvance.idPGeneral = this.data.IdPGeneral;
    this.EncuestaAvance.idPEspecifico = this.data.IdPEspecifico;

    // Iterar sobre las categorías de preguntas de la encuesta
    this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {
      const categoriaObjInicial: EncuestaAvanceCategoriaDTO = {
        idCategoria: categoria.idCategoria,
        nombreCategoria: categoria.nombreCategoria,
        preguntas: []
      };
      this.EncuestaAvance.categorias.push(categoriaObjInicial);

      categoria.preguntas.forEach((p: any) => {
        const preguntaObjInicial: EncuestaAvancePreguntaDTO = {
          idPregunta: p.id,
          pregunta: p.pregunta,
          idPreguntaEncuestaTipo: p.idPreguntaEncuestaTipo,
          valorRespuesta: []
        };
        categoriaObjInicial.preguntas.push(preguntaObjInicial);

        if (p.idPreguntaEncuestaTipo === 3) {
          const respuesta = p.alternativas?.[0]?.respuesta || '';
          const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = { respuesta: respuesta }; // Usar recpuesta como número
          preguntaObjInicial.valorRespuesta.push(respuestaObj);

        } else if (p.idPreguntaEncuestaTipo === 1) {
          p.alternativas.forEach((a: any) => {
            if (a.select) {
              const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = { respuesta: a.respuesta };
              preguntaObjInicial.valorRespuesta.push(respuestaObj);
            }
          });

        } else if (p.idPreguntaEncuestaTipo === 2) {
          p.alternativas.forEach((a: any) => {
            if (a.select) {
              const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = { respuesta: a.respuesta };
              preguntaObjInicial.valorRespuesta.push(respuestaObj);
            }
          });

        } else if (p.idPreguntaEncuestaTipo === 4) {
          const valorRanking = p.valorRanking || 0;
          const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = { respuesta: valorRanking.toString() }; // Guardar ranking como número
          preguntaObjInicial.valorRespuesta.push(respuestaObj);
        }
      });
    });
    this.verificarRespuestasCompletas();
  }

  verificarRespuestasCompletas() {
    this.EncuestaCompleta = true;
    this.EncuestaAvance.categorias.forEach((categoria: EncuestaAvanceCategoriaDTO) => {
      categoria.preguntas.forEach((pregunta: EncuestaAvancePreguntaDTO) => {
        if (pregunta.valorRespuesta.length === 0 || pregunta.valorRespuesta[0].respuesta === 0) {
          this.EncuestaCompleta = false;
        }
      });
    });
  }


  AgregarPEspecificoSesionEncuestaAlumno(valor: boolean) {
    this._PEspecificoEsquemaService.AgregarPEspecificoSesionEncuestaAlumno(this.EncuestaAvance).pipe(takeUntil(this.signal$))
      .subscribe({
      next: (x) => {
        this.dialogRef.close('guardado');
      },
      complete:()=>{
      }})
  }
}
