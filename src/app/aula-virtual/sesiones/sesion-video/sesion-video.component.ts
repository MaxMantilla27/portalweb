import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ParametrosCrucigramaVideoSesionDTO, ParametrosEstructuraEspecificaDTO, ParametrosVideoSesionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CrucigramaService } from 'src/app/Core/Shared/Services/Crucigrama/crucigrama.service';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';

@Component({
  selector: 'app-sesion-video',
  templateUrl: './sesion-video.component.html',
  styleUrls: ['./sesion-video.component.scss']
})
export class SesionVideoComponent implements OnInit,OnChanges {

  constructor(
    private _VideoSesionService:VideoSesionService,
    private _CrucigramaService:CrucigramaService
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
  @Input() charge:boolean|undefined=false;
  public videoData:any;
  @Input() crucigramaData:any;
  @Input() NombreCapitulo=''
  public crucigrama:ParametrosCrucigramaVideoSesionDTO={
    AccesoPrueba:false,
    IdCapitulo:0,
    IdPGeneral:0,
    IdSesion:0
  }
  public parametros:ParametrosVideoSesionDTO={
    AccesoPrueba:this.json.AccesoPrueba,
    IdCapitulo:this.idCapitulo,
    IdMatriculaCabecera:this.json.IdMatriculaCabecera,
    IdPGeneral:this.json.IdPGeneralHijo,
    IdSesion:this.idSesion,
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

      this.crucigrama.AccesoPrueba=this.json.AccesoPrueba;
      this.crucigrama.IdCapitulo=this.idCapitulo;
      this.crucigrama.IdPGeneral=this.json.IdPGeneralHijo;
      this.crucigrama.IdSesion=this.idSesion;
      this.ObtenerCrucigramaProgramaCapacitacionSesion()
      this.ObtenerVideoProgramaCapacitacionSesion()
    }
  }
  ObtenerVideoProgramaCapacitacionSesion(){
    this._VideoSesionService.ObtenerVideoProgramaCapacitacionSesion(this.parametros).subscribe({
      next:x=>{
        console.log(x)
        this.videoData=x;
      }
    })
  }
  ObtenerCrucigramaProgramaCapacitacionSesion(){
    this._CrucigramaService.ObtenerCrucigramaProgramaCapacitacionSesion(this.crucigrama).subscribe({
      next:x=>{
        console.log(x)
        this.crucigramaData=x;
      }
    })
  }
}
