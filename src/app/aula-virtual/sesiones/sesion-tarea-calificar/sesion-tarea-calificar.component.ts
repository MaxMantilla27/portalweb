import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ParametroEnvioTrabajoPares, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
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
  public enviarJson:ParametroEnvioTrabajoPares={
    IdEscalaCalificacionDetalle:0,
    IdEsquemaEvaluacionPGeneralDetalle:0,
    IdEvaluacion:0,
    IdParametroEvaluacion:0,
    ValorCalificado:0,
  }
  public tarea:any
  public tareaAc:any;
  public cargaEnvio=false;
  public calificacion=0;
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idtarea>0 && this.charge==true){
      console.log(this.id)
      this.params.idEvaluacion=this.idtarea;
      this.params.idPEspecifico=this.json.IdPEspecificoHijo
      this.params.idPEspecificoPadre=this.json.IdPEspecificoPadre
      this.params.idPGeneral=this.json.IdPGeneralHijo
      this.params.idPrincipal=this.json.IdPGeneralPadre
      this.ObtenerEvaluacionTarea()
    }
  }
  ObtenerEvaluacionTarea(){
    this._TareaEvaluacionService.ObtenerEvaluacionTrabajoPares(this.params).subscribe({
      next:x=>{
        this.tarea=x
        if(this.tarea.datosTrabajoPares!=undefined && this.tarea.datosTrabajoPares.instruccionesEvaluacion!=undefined &&
          this.tarea.datosTrabajoPares!=null && this.tarea.datosTrabajoPares.instruccionesEvaluacion!=null)
        this.tarea.datosTrabajoPares.instruccionesEvaluacion.sort(function (a:any, b:any) {
          return a.zonaWeb - b.zonaWeb;
        })
        console.log(this.tarea)
        this.tarea.registroTareaEvaluacionArchivo.forEach((t:any) => {
          if(t.id==this.id){
            this.tareaAc=t
          }
        });
        console.log(this.tareaAc)
      }
    })
  }
  EnviarNota(){
    this.cargaEnvio=true
    var cal=0;
    console.log(this.calificacion)
    this.tarea.criteriosEvaluacion.listaParametroEscalaEvaluacion.forEach((p:any) => {
      if(p.id==this.calificacion){
        cal=p.valor
      }
    });
    this.enviarJson.IdEscalaCalificacionDetalle=this.calificacion
    this.enviarJson.IdEvaluacion=this.tareaAc.id
    this.enviarJson.ValorCalificado=cal
    this.enviarJson.IdParametroEvaluacion=this.tarea.criteriosEvaluacion.idParametroEvaluacion
    this.enviarJson.IdEsquemaEvaluacionPGeneralDetalle=this.tarea.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle
    console.log(this.enviarJson);
    this._TareaEvaluacionService.EnviarCalificacionTrabajoPares(this.enviarJson).subscribe({
      next:x=>{
        console.log(x)
        this.tareaAc.calificado=true
      },
      error:x=>{
        console.log(x)
      }
    })
  }

}
