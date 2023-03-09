import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CardMatriculasDTO } from 'src/app/Core/Models/BasicDTO';
import { ResetearCrucigramasPreguntasPrueba } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CrucigramaService } from '../../../Services/Crucigrama/crucigrama.service';
import { HelperService } from '../../../Services/helper.service';
import { SnackBarServiceService } from '../../../Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-card-matriculas',
  templateUrl: './card-matriculas.component.html',
  styleUrls: ['./card-matriculas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardMatriculasComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    private _HelperService:HelperService,
    private _CrucigramaService:CrucigramaService,
    private _SnackBarServiceService:SnackBarServiceService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public IdPruebas=9818325
  @Input() cardContent:CardMatriculasDTO={Img:'',Title:'',ImgAlt:'',Tipo:1,Url:''};
  @Input() matricula:any
  ngOnInit(): void {
  }
  updateUrl() {
    this.cardContent.Img = '../../../../../../assets/imagenes/sello.jpg';
  }
  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:this.cardContent.Title,Programa:this.cardContent.Title})
  }
  ResetearCrucigramasPreguntasUsuarioPrueba(data:ResetearCrucigramasPreguntasPrueba){
    this._CrucigramaService.ResetearCrucigramasPreguntasUsuarioPrueba(data).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        var mensaje='El avance de los crucigramas fue eliminado'
        if(data.EsCruCigrama==false){
          mensaje='El avance de las preguntas fue eliminado'
        }
        this._SnackBarServiceService.openSnackBar(mensaje,'x',15,"snackbarCrucigramaSucces");
      }
    })
  }
  ResetearEstructuraEspecificaPorMatricula(IdMatriculaCabecera:number){
    this._CrucigramaService.ResetearEstructuraEspecificaPorMatricula(IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        this._SnackBarServiceService.openSnackBar("La estructura fue restablecida",'x',15,"snackbarCrucigramaSucces");
      }
    })
  }
}
