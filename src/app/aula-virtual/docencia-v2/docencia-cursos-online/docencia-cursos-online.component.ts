import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

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
    private _DatosPerfilService:DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    ) { }
  Cursos:any
  filterCurso=''
  Estados:Array<any>=[
    {id:1,Nombre:'Finalizado'},
    {id:2,Nombre:'Ejecución'},
    {id:3,Nombre:'Por Ejecutar'}
  ]
  EstadoPespecifico=0
  public TerminaCarga=false;
  ngOnInit(): void {
    this.ObtenerCursosOnlineWebinarDocentePortalWeb()
  }
  ObtenerCursosOnlineWebinarDocentePortalWeb(){
    this._DatosPerfilService.ObtenerCursosOnlineWebinarDocentePortalWeb().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=true;
        this.Cursos=x
        console.log(this.Cursos)
        if(this.Cursos!=null){
          if(this.Cursos.length!=0){
            this.Cursos.forEach((c:any) => {
              if(c.idEstadoPEspecifico==5){
                c.idEstadoPEspecifico=3
              }
              c.Visible=true
            });
          }
        }
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
  saveIndex(index:number){
    this._SessionStorageService.SessionSetValue('cursoOnlineCursoIndex',index.toString());
  }
}
