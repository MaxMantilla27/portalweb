import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-curso-clase-online',
  templateUrl: './curso-clase-online.component.html',
  styleUrls: ['./curso-clase-online.component.scss']
})
export class CursoClaseOnlineComponent implements OnInit,OnDestroy,OnChanges {

  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService:DatosPerfilService
  ) { }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public clases:any
  columnHeader = {
    'fechaHoraInicio': 'Fecha Inicio',
    'HoraInicio': 'Hora Inicio',
    'Acciones': 'Acciones', };

  TipoContenido:any={
    'fechaHoraInicio': ['date'],
    'HoraInicio': ['hora'],
    'Acciones': ['url','urlWebex'],
    //'Acciones': ['buttons'],
  }
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
      this.ListaCursoWebexMatriculado();
    }
  }
  ListaCursoWebexMatriculado(){
    this._DatosPerfilService.ListaCursoWebexMatriculado(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.clases=x
        if(this.clases!=undefined && this.clases!=null && this.clases.length){
          this.clases.forEach((c:any) => {
            c.HoraInicio=c.fechaHoraInicio;

            c.Acciones=c.urlWebex==null?'Próximamente':'Ir  a clase'
          });
        }
      },
      error:e=>{
        console.log(e)
      }
    })
  }
}
