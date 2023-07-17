import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-docencia-cursos-online',
  templateUrl: './docencia-cursos-online.component.html',
  styleUrls: ['./docencia-cursos-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaCursosOnlineComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _DatosPerfilService:DatosPerfilService
    ) { }
  Cursos:any
  filterCurso=''
  Estados:Array<any>=[
    {id:1,Nombre:'Finzalizado'},
    {id:2,Nombre:'En Ejecución'}
  ]
  EstadoPespecifico=0
  ngOnInit(): void {
    this.ObtenerCursosOnlineWebinarDocentePortalWeb()
  }
  ObtenerCursosOnlineWebinarDocentePortalWeb(){
    this._DatosPerfilService.ObtenerCursosOnlineWebinarDocentePortalWeb().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.Cursos=x
        this.Cursos.forEach((c:any) => {
          c.Visible=true
        });
      }
    })
  }
  FilterCursos(){
    this.Cursos.forEach((e:any) => {
      e.Visible=true
      if(this.filterCurso.length>0){
        var name=e.cursoNombre.toUpperCase();
        if(!name.includes(this.filterCurso.toUpperCase())){
          e.Visible=false
        }
      }
      if(this.EstadoPespecifico!=0){
        if(this.EstadoPespecifico!=e.idEstadoPEspecifico){
          e.Visible=false
        }
      }
    });
  }
}
