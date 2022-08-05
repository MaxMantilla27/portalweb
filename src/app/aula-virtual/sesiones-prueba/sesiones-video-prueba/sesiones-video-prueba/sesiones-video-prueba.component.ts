import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO, ParametrosVideoSesionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
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
  @Input() nombreSesion=''
  @Input() idCapitulo=0;
  @Input() idSesion=0;
  @Input() OrdenSeccion=0;
  @Input() charge:boolean|undefined=false;
  public videoData:any;
  @Input() crucigramaData:any;
  @Input() NombreCapitulo='';
  public parametros:ParametrosVideoSesionDTO={
    AccesoPrueba:this.json.AccesoPrueba,
    IdCapitulo:this.idCapitulo,
    IdMatriculaCabecera:this.json.IdMatriculaCabecera,
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

    if(this.charge==true){
      this.parametros.IdSesion=this.idSesion;
      this.parametros.IdCapitulo=this.idCapitulo;
      this.parametros.AccesoPrueba=this.json.AccesoPrueba;
      this.parametros.IdMatriculaCabecera=this.json.IdMatriculaCabecera;
      this.parametros.IdPGeneral=this.json.IdPGeneralHijo;
      this.ObtenerVideoProgramaCapacitacionSesion()
    }
  }
  ObtenerVideoProgramaCapacitacionSesion(){
    console.log(this.parametros)
    this._VideoSesionService.ObtenerVideoProgramaCapacitacionSesionPrueba(this.parametros).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.videoData=x;
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
}
