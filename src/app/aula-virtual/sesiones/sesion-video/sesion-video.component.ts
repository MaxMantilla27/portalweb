import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosCrucigramaVideoSesionDTO, ParametrosEstructuraEspecificaDTO, ParametrosVideoSesionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CrucigramaService } from 'src/app/Core/Shared/Services/Crucigrama/crucigrama.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';
import { RegistrarErrorComponent } from './registrar-error/registrar-error/registrar-error.component';


@Component({
  selector: 'app-sesion-video',
  templateUrl: './sesion-video.component.html',
  styleUrls: ['./sesion-video.component.scss']
})
export class SesionVideoComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _VideoSesionService:VideoSesionService,
    private _CrucigramaService:CrucigramaService,
    private _HelperService:HelperService,
    public dialog: MatDialog
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
  @Input() nombreSesion=''
  @Input() idCapitulo=0;
  @Input() idSesion=0;
  @Input() OrdenSeccion=0;
  @Input() charge:boolean|undefined=false;
  public videoData:any;
  @Input() crucigramaData:any;
  @Input() NombreCapitulo=''
  @Input() habilitado=false
  @Input() nextChapter:any;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();
  public AbrirModal=false
  public crucigrama:ParametrosCrucigramaVideoSesionDTO={
    AccesoPrueba:false,
    IdCapitulo:0,
    IdPGeneral:0,
    IdSesion:0
  }
  public estadovideo=0;
  public parametros:ParametrosVideoSesionDTO={
    AccesoPrueba:this.json.AccesoPrueba,
    IdCapitulo:this.idCapitulo,
    IdMatriculaCabecera:this.json.IdMatriculaCabecera,
    IdPGeneral:this.json.IdPGeneralHijo,
    IdSesion:this.idSesion,
    OrdenSeccion:this.OrdenSeccion
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    // if(this.charge==true){
    //   this.ObtenerVideoProgramaCapacitacionSesion()
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {

    if(this.charge==true && this.habilitado==true){
      this.parametros.IdSesion=this.idSesion;
      this.parametros.IdCapitulo=this.idCapitulo;
      this.parametros.AccesoPrueba=this.json.AccesoPrueba;
      this.parametros.IdMatriculaCabecera=this.json.IdMatriculaCabecera;
      this.parametros.IdPGeneral=this.json.IdPGeneralHijo;
      this.parametros.OrdenSeccion=this.OrdenSeccion;

      this.crucigrama.AccesoPrueba=this.json.AccesoPrueba;
      this.crucigrama.IdCapitulo=this.idCapitulo;
      this.crucigrama.IdPGeneral=this.json.IdPGeneralHijo;
      this.crucigrama.IdSesion=this.idSesion;
      this.ObtenerCrucigramaProgramaCapacitacionSesion()
      this.ObtenerVideoProgramaCapacitacionSesion()
    }
  }
  ObtenerVideoProgramaCapacitacionSesion(){
    this._VideoSesionService.ObtenerVideoProgramaCapacitacionSesion(this.parametros).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.videoData=x;
        if(this.videoData!=undefined){
          var calc=Math.ceil(this.videoData.tiempoVisualizado*100/this.videoData.tiempoTotalVideo);
          this.estadovideo=calc
        }
        if(this.videoData.tiempoTotalVideo>=3600){
          this.videoData.h=this.redondearAbajo(this.videoData.tiempoTotalVideo,3600)
          this.videoData.min=this.redondearAbajo(this.videoData.tiempoTotalVideo-(this.videoData.h*3600),60)
        }else{
          this.videoData.min=this.redondearAbajo(this.videoData.tiempoTotalVideo,60)
        }
        this.videoData.sec=this.redondearAbajo(this.videoData.tiempoTotalVideo%60,1)
      }
    })
  }
  ObtenerCrucigramaProgramaCapacitacionSesion(){
    this._CrucigramaService.ObtenerCrucigramaProgramaCapacitacionSesion(this.crucigrama).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.crucigramaData=x;
      }
    })
  }
  redondearAbajo(e:number,div:number){
    var r=Math.floor(e/div)
    console.log(r)
    if(r<10){
      return '0'+r
    }
    return r
  }
  OpenModal(): void {
    const dialogRef = this.dialog.open(RegistrarErrorComponent, {
      width: '500px',
      data: { IdPGeneral:this.json.IdPGeneralHijo,IdCapitulo:this.idCapitulo ,IdSesion:this.idSesion},
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  nextc(){
    console.log(this.videoData)
    if(this.videoData!=undefined){
      var calc=Math.ceil(this.videoData.tiempoVisualizado*100/this.videoData.tiempoTotalVideo);
      if(calc>=100){
        this.next.emit();
      }
    }
  }
  prevc(){
    this.prev.emit();
  }
  onFinishVideo(){
    console.log(this.videoData);
    console.log(this.estadovideo);
    this.onFinish.emit();
    this.estadovideo=100;
    this.videoData.tiempoVisualizado=this.videoData.tiempoTotalVideo
  }
  Interaccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre})
  }
}
