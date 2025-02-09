import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaAccesoPruebaDTO, ParametrosEstructuraEspecificaDTO, ParametrosVideoSesionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';

@Component({
  selector: 'app-sesiones-video-prueba',
  templateUrl: './sesiones-video-prueba.component.html',
  styleUrls: ['./sesiones-video-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SesionesVideoPruebaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _VideoSesionService:VideoSesionService,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() json: ParametrosEstructuraEspecificaAccesoPruebaDTO = {
    AccesoPrueba: true,
    IdAccesoPrueba: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad:1,
    visualizarVideos:false,
    accesoCompleto:false,
  };
  @Input() nombreSesion=''
  @Input() idCapitulo=0;
  @Input() idSesion=0;
  @Input() OrdenSeccion=0;
  @Input() habilitado=false
  @Input() charge:boolean|undefined=false;
  public videoData:any;
  @Input() crucigramaData:any;
  @Input() NombreCapitulo='';
  @Input() nextChapter:any;
  public estadovideo=0;
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();

  public parametros:ParametrosVideoSesionDTO={
    AccesoPrueba:true,
    IdCapitulo:this.idCapitulo,
    IdMatriculaCabecera:this.json.IdAccesoPrueba,
    IdPGeneral:this.json.IdPGeneralHijo,
    IdSesion:this.idSesion,
    OrdenSeccion:this.OrdenSeccion,
  }
  ngOnInit(): void {
    // if(this.charge==true){
    //   this.ObtenerVideoProgramaCapacitacionSesion()
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.charge)

    if(this.charge==true ){
      this.parametros.IdSesion=this.idSesion;
      this.parametros.IdCapitulo=this.idCapitulo;
      this.parametros.AccesoPrueba=true;
      this.parametros.IdMatriculaCabecera=this.json.IdAccesoPrueba;
      this.parametros.IdPGeneral=this.json.IdPGeneralHijo;
      this.parametros.OrdenSeccion=this.OrdenSeccion;
      this.ObtenerVideoProgramaCapacitacionSesion()
    }
  }
  ObtenerVideoProgramaCapacitacionSesion(){
    console.log(this.parametros)
    this._VideoSesionService.ObtenerVideoProgramaCapacitacionSesionPrueba(this.parametros).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.videoData=x;
        if(this.videoData!=undefined){
          var calc=Math.ceil(this.videoData.tiempoVisualizado*100/this.videoData.tiempoTotalVideo);
          this.estadovideo=calc
        }
      }
    })
  }
  redondearAbajo(e:number,div:number){
    var r=Math.floor(e/div)
    if(r<10){
      return '0'+r
    }
    return r
  }
  nextc(){
    console.log(this.videoData)
    if(this.videoData!=undefined){
      var calc=Math.ceil(this.videoData.tiempoVisualizado*100/this.videoData.tiempoTotalVideo);
      console.log(calc)
      if(calc>=100){
        this.next.emit();
      }
    }
  }
  onFinishVideo(){
    console.log(this.videoData);
    console.log(this.estadovideo);
    this.onFinish.emit();
    this.estadovideo=100;
    this.videoData.tiempoVisualizado=this.videoData.tiempoTotalVideo
  }
  prevc(){
    this.prev.emit();
  }
}
