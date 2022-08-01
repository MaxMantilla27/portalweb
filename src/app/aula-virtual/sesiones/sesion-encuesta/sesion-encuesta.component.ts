import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ParametroEnvioEncuestaDTO, ParametrosEncuestaDTO } from 'src/app/Core/Models/EncuestaDTO';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { EncuestaService } from 'src/app/Core/Shared/Services/Encuesta/encuesta.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-sesion-encuesta',
  templateUrl: './sesion-encuesta.component.html',
  styleUrls: ['./sesion-encuesta.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SesionEncuestaComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _EncuestaService:EncuestaService,
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
  @Input() idEncuesta=0;
  @Input() NombreCapitulo=''
  @Input() idCapitulo=0;
  @Input() habilitado=false
  @Input() charge:boolean|undefined=false;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  public params:ParametrosEncuestaDTO={
    IdEvaluacion:0,
    IdPGeneral:0,
  }
  public jsonEnvio:ParametroEnvioEncuestaDTO={
    IdPEspecifico:0,
    IdPEspecificoPadre:0,
    IdPGeneral:0,
    IdPrincipal:0,
    Respuestas:[]
  }
  public encuesta:any
  public mensajeError=''
  public preguntaError=0;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.charge)
    if(this.idEncuesta>0 && this.charge==true && this.habilitado==true){
      this.params.IdEvaluacion=this.idEncuesta;
      this.params.IdPGeneral=this.json.IdPGeneralHijo;
      this.ObtenerEncuestaEvaluacion();
    }
  }
  ObtenerEncuestaEvaluacion(){
    this._EncuestaService.ObtenerEncuestaEvaluacion(this.params).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.encuesta=x
        if(this.encuesta.contenidoEncuesta!=null){
          this.encuesta.contenidoEncuesta.forEach((e:any) => {
            e.listaRespuestas.forEach((r:any) => {
              r.value='';
            });
          });
        }
      }
    })
  }
  changeRespuesta(index:number,index2:number){
    console.log(this.encuesta.contenidoEncuesta[index])
    var tipoP=parseInt(this.encuesta.contenidoEncuesta[index].tipoPregunta);
    if(tipoP==4){
      var val=this.encuesta.contenidoEncuesta[index].listaRespuestas[index2].value==true?true:false;
      this.encuesta.contenidoEncuesta[index].listaRespuestas[index2].value=!val
    }else{
      this.encuesta.contenidoEncuesta[index].listaRespuestas.forEach((r:any) => {
        r.value=false
      });
      this.encuesta.contenidoEncuesta[index].listaRespuestas[index2].value=true
    }
  }
  getEnvio(){
    this.jsonEnvio.IdPEspecifico=this.json.IdPEspecificoHijo;
    this.jsonEnvio.IdPEspecificoPadre=this.json.IdPEspecificoPadre
    this.jsonEnvio.IdPGeneral=this.json.IdPGeneralHijo
    this.jsonEnvio.IdPrincipal=this.json.IdPGeneralPadre
    console.log(this.encuesta)
    var value=true
    this.preguntaError=0;
    this.encuesta.contenidoEncuesta.forEach((e:any) => {
      var cant=0
      e.listaRespuestas.forEach((r:any) => {
        if(r.value!='' && r.value!=false){
          cant++;
          this.jsonEnvio.Respuestas.push({
            Id:0,
            IdExamenAsignado:this.encuesta.datosEncuesta.id,
            IdPregunta:e.idPregunta,
            IdRespuesta:r.idRepuesta,

            TextoRespuesta:(e.tipoPregunta!=5 && e.tipoPregunta!=4 && e.tipoPregunta!=3)?r.value:''
          })
        }
      });
      this.preguntaError++
      console.log(cant)
      if(cant==0){
        if(value==true){
          if(e.tipoPregunta==4){
            this.mensajeError='Debe seleccionar al menos una alternativa en la pregunta '+this.preguntaError
          }else{
            if(e.tipoPregunta==5 || e.tipoPregunta==3){
              this.mensajeError='Seleccione una opcion en la pregunta '+this.preguntaError
            }else{
              this.mensajeError='Debe rellenar al menos una casilla en la pregunta '+this.preguntaError
            }
          }
        }
        value=false
      }
    });
    return value;
  }
  enviarEncuesta(){
    this.jsonEnvio.Respuestas=[];
    var estado=this.getEnvio()
    console.log(estado)
    if(estado==false){
      this._SnackBarServiceService.openSnackBar(this.mensajeError,'x',15,"snackbarCrucigramaerror");
    }else{
      this._EncuestaService.EnviarEncuestaEvaluacion(this.jsonEnvio).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x);
          this.encuesta.contenidoEncuesta=null;
        }
      })
    }
  }
  nextc(){
    console.log(this.encuesta)
    if(this.encuesta.contenidoEncuesta==null){
      if(this.encuesta.datosEncuesta.titulo!='Encuesta Final'){
        this.next.emit();
      }
    }
  }
  prevc(){
    if(this.encuesta.datosEncuesta.titulo!='Encuesta Inicial'){
      this.prev.emit();
    }
  }
}
