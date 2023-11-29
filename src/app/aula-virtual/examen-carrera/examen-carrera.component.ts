import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as moment  from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { AgregarExamenSuficienciaAlumnoDTO, ExamenSuficienciaRespuestasDTO, ExamenSuficienciaRespuestasPreguntasDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-examen-carrera',
  templateUrl: './examen-carrera.component.html',
  styleUrls: ['./examen-carrera.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ExamenCarreraComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    private _HelperService: HelperService,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,


    ) { }
  @Input() IdMatricula=0;

  public minutos=45
  public segundos=0
  public interval:any;
  public vertiempo=false
  public fechaInicio=new Date();
  public preguntaSeleccionada=0
  public Examen:any;
  public RespuestaMarcada=false;
  public disableAll=false
  public json:AgregarExamenSuficienciaAlumnoDTO={
    id:0,
    idMatriculaCabecera:0,
    idPEspecifico:0,
    preguntas:[],
    nota:0,
    usuario:'Alumno'
  }
  public ExamenEnviado=false;


  ngOnInit(): void {
    this.ExamenEnviado=false
    this.ObtenerContenidoExamenSuficiencia();
  }
  @Output() Volver= new EventEmitter<void>();
  cronometro(MinutosConfigurados:number){
    this.interval=setInterval(() => {
      var fecha1 = moment(this.fechaInicio);
      var fecha2 = moment(new Date());
      var segundoDif=fecha2.diff(fecha1, 'seconds')
      var totalSegundo=MinutosConfigurados*60

      if(segundoDif>totalSegundo){
        this.vertiempo=false
        this.AgregarExamenSuficienciaProfesionalCarrera();
      }else{
        this.minutos=Math.floor((totalSegundo-segundoDif)/60);
        this.segundos=(totalSegundo-segundoDif)%60
      }
    }, 1000);
  }
  cambiarPregunta(i:number){
    var c=0
    this.Examen.preguntas[this.preguntaSeleccionada].respuestas.forEach((element:any) => {
      if(this.Examen.preguntas[this.preguntaSeleccionada].idPreguntaTipo!=6){
        if(element.respuestaSeleccionada==true){
          this.Examen.preguntas[this.preguntaSeleccionada]=true
          c++
        }
      }
      else{
        if(element.respuestaTexto!='' && element.respuestaTexto!=null){
          element.respuestaSeleccionada=true
          this.Examen.preguntas[this.preguntaSeleccionada]=true
          c++
        }
        else{
          this.Examen.preguntas[this.preguntaSeleccionada]=false
          element.respuestaSeleccionada=false
        }
      }
    });
    if(c>0){
      this.Examen.preguntas[this.preguntaSeleccionada].respondida=true
    }
    else{
      this.Examen.preguntas[this.preguntaSeleccionada].respondida=false
    }
    this.preguntaSeleccionada=i
  }
  Siguiente(){
    var c=0
    this.Examen.preguntas[this.preguntaSeleccionada].respuestas.forEach((element:any) => {
      if(this.Examen.preguntas[this.preguntaSeleccionada].idPreguntaTipo!=6){
        if(element.respuestaSeleccionada==true){
          c++
        }
      }
      else{
        if(element.respuestaTexto!='' && element.respuestaTexto!=null){
          element.respuestaSeleccionada=true
          c++
        }
        else{
          element.respuestaSeleccionada=false
        }
      }
    });
    if(c>0){
      this.Examen.preguntas[this.preguntaSeleccionada].respondida=true
    }
    else{
      this.Examen.preguntas[this.preguntaSeleccionada].respondida=false
    }
    this.preguntaSeleccionada++
  }
  Anterior(){
    this.preguntaSeleccionada=this.preguntaSeleccionada-1
  }
  finalizar(){
    this.Volver.emit()
  }
  ObtenerContenidoExamenSuficiencia(){
    this._ProgramaContenidoService.ObtenerContenidoExamenSuficienciaProfesionalCarrera(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.Examen=x;
        console.log(this.Examen)
      },
      complete:()=>{
        if(this.Examen.FechaEnvio==null){
          this.vertiempo=true;
          this.cronometro(this.Examen.tiempoLimite)
        }
      }
    })
  }
  chageRadio(value: boolean,i: number, j: number) {
    if (value == false && this.Examen.preguntas[i].respuestas[j] &&
       (this.Examen.preguntas[i].idPreguntaTipo==3 ||this.Examen.preguntas[i].idPreguntaTipo==5)) {
      this.Examen.preguntas[i].respuestas.forEach((x:any)=>{
        x.respuestaSeleccionada=false
      })
      return true;
    }
    if (value == true && this.Examen.preguntas[i].respuestas[j]  &&
      (this.Examen.preguntas[i].idPreguntaTipo==3 ||this.Examen.preguntas[i].idPreguntaTipo==5)) {
      return false;
    }
    if (value == false && this.Examen.preguntas[i].respuestas[j]  && this.Examen.preguntas[i].idPreguntaTipo==4) {
      return true;
    }
    if (value == true && this.Examen.preguntas[i].respuestas[j]  && this.Examen.preguntas[i].idPreguntaTipo==4) {
      return false;

    }
    else return false;
  }
  VerificarMarcado(i:number){
    this.RespuestaMarcada=false
    this.Examen.preguntas[i].respuestas.forEach((x:any)=>{
      if( x.respuestaSeleccionada==true){
        this.RespuestaMarcada=true
      }
    })
  }
  AgregarExamenSuficienciaProfesionalCarrera(){
    this.vertiempo=false;
    clearInterval(this.interval)
    console.log(this.Examen.preguntas)
    this.ExamenEnviado=true;
    this.json.preguntas=[]
    this.json.id=this.Examen.id
    this.json.idMatriculaCabecera= this.Examen.idMatriculaCabecera
    this.json.idPEspecifico= this.Examen.idPEspecifico
    this.json.usuario='Alumno'
    var PreguntasEnvio:Array<ExamenSuficienciaRespuestasPreguntasDTO>=[]
    let PuntosExamen=0;
    this.Examen.preguntas.forEach((x:any) => {

      if(x.idPreguntaTipo==6){
        var respuestaEnvio: Array<ExamenSuficienciaRespuestasDTO>=[]
        x.respuestas.forEach((y:any) => {
          respuestaEnvio.push({
            id:y.id,
            correcto: false,
            respuestaSeleccionada:y.respuestaSeleccionada,
            respuestaTexto:y.respuestaTexto
          })
        })
      }
      else{
        var respuestaEnvio: Array<ExamenSuficienciaRespuestasDTO>=[]
        x.respuestas.forEach((y:any) => {
          let CorrectoAlternativa=false
          let Puntos=0;
          if (y.respuestaSeleccionada && y.esCorrecta){
            CorrectoAlternativa=true;
            Puntos=y.puntaje;
            PuntosExamen=PuntosExamen+y.puntaje;
          }
          respuestaEnvio.push({
            id:y.id,
            correcto: CorrectoAlternativa,
            puntos: Puntos,
            respuestaSeleccionada:y.respuestaSeleccionada,
            respuestaTexto:y.respuestaTexto
          })
        })
      }
      PreguntasEnvio.push({
        id:x.id,
        respondida:x.respondida,
        respuestas:respuestaEnvio
      })
    });
    this.json.nota=PuntosExamen,
    this.json.preguntas=PreguntasEnvio;
    console.log(this.json)
    this._PEspecificoEsquemaService.AgregarExamenSuficienciaProfesionalCarrera(this.json).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
      },
    });
  }
}
