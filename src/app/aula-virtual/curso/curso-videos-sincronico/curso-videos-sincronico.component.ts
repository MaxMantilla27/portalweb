import { Component, Inject, Input, LOCALE_ID, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { DatePipe, formatDate } from "@angular/common";
@Component({
  selector: 'app-curso-videos-sincronico',
  templateUrl: './curso-videos-sincronico.component.html',
  styleUrls: ['./curso-videos-sincronico.component.scss']
})
export class CursoVideosSincronicoComponent implements OnInit,OnChanges {

  constructor(
    private _SnackBarServiceService:SnackBarServiceService,
    @Inject(LOCALE_ID) private locale: string
  ) { }
  @Input() videos: Array<any>=[];
  @Input() Capitulo='';
  pipe = new DatePipe('es')
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.videos.length>0){
      this.videos.forEach((v:any) => {
        v.open=false
        v.idVideo='<iframe src="https://player.vimeo.com/video/'+v.idVideo+'" width="100%" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
        //v.idVideo='https://player.vimeo.com/video/'+v.idVideo
      });
    }
  }
  Open(index:number){
    if(this.videos[index].inicioVideo==true && this.videos[index].expiroVideo==false){
      console.log('-----')
      this.videos[index].open=!this.videos[index].open
    }else{
      var error=''


      if(this.videos[index].inicioVideo==false){
        var fecha= this.pipe.transform(this.videos[index].fechaInicio, 'yyyy/MM/dd');
        error='El video estara disponible apartir de la siguiente fecha '+fecha
      }
      if(this.videos[index].expiroVideo==true){
        var fecha= this.pipe.transform(this.videos[index].fechaFin, 'yyyy/MM/dd',this.locale);
        error='El video expiro la fecha '+fecha
      }
      console.log(error)
      this._SnackBarServiceService.openSnackBar(
        error,
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
  }
}
