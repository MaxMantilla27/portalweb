import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';

@Component({
  selector: 'app-sesion-tarea-calificar',
  templateUrl: './sesion-tarea-calificar.component.html',
  styleUrls: ['./sesion-tarea-calificar.component.scss']
})
export class SesionTareaCalificarComponent implements OnInit,OnChanges {

  constructor(
    private _TareaEvaluacionService:TareaEvaluacionService,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }
  @Input() json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad:1
  };
  @Input() idtarea=0;
  @Input() NombreCapitulo=''
  @Input() idCapitulo=0;
  @Input() id=0;
  public params:ParametroObtenerEvaluacionTarea={
    idEvaluacion:0,
    idPEspecifico:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
  }
  @Input() charge:boolean|undefined=false;
  public tarea:any
  public tareaAc:any;
  public cargaEnvio=false;
  public calificacion=0;
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.id)
    if(this.idtarea>0 && this.charge==true){
      this.params.idEvaluacion=this.idtarea;
      this.params.idPEspecifico=this.json.IdPEspecificoHijo
      this.params.idPEspecificoPadre=this.json.IdPEspecificoPadre
      this.params.idPGeneral=this.json.IdPGeneralHijo
      this.params.idPrincipal=this.json.IdPGeneralPadre
      this.ObtenerEvaluacionTarea()
    }
  }
  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTarea(this.params).subscribe({
      next:x=>{
        this.tarea=x
        if(this.tarea.datosEvaluacionTrabajo!=undefined && this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion!=undefined &&
          this.tarea.datosEvaluacionTrabajo!=null && this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion!=null)
        this.tarea.datosEvaluacionTrabajo.instruccionesEvaluacion.sort(function (a:any, b:any) {
          return a.zonaWeb - b.zonaWeb;
        })
        console.log(this.tarea)
        this.tarea.registroEvaluacionArchivo.forEach((t:any) => {
          if(t.id==this.id){
            this.tareaAc=t
          }
        });
      }
    })
  }
  EnviarNota(){

  }

}
