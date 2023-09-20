import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-docencia-cursos-aonline-responder-foro',
  templateUrl: './docencia-cursos-aonline-responder-foro.component.html',
  styleUrls: ['./docencia-cursos-aonline-responder-foro.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaCursosAonlineResponderForoComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _ForoCursoService: ForoCursoService,
  ) { }
  Estados:Array<any>=[
    {id:0,Nombre:'Pendiente'},
    {id:1,Nombre:'Resuelto'}
  ]
  Foros:any
  filterForos=''
  EstadoPendiente=-1;
  public ContenidoCurso=false;
  public IdPGeneralForo=0;
  public TerminaCarga=false;
  ngOnInit(): void {
    this.TerminaCarga=false;
    this.IdPGeneralForo=0;
    this.ContenidoCurso=false;
    this.ObtenerCursosForoDocentePortalWeb()
  }
  ObtenerCursosForoDocentePortalWeb(){
    this._ForoCursoService.ObtenerCursosForoDocentePortalWeb().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=true;
        this.Foros=x
        if(this.Foros!=null){
          if(this.Foros.length!=0){
            this.Foros.forEach((c:any) => {
              c.Visible=true
            });
          }
        }
      }
    })
  }
  FiltrarForos(){
    this.Foros.forEach((e:any) => {
      e.Visible=true
      if(this.filterForos.length>0){
        var name=e.pGeneral.toUpperCase();
        if(!name.includes(this.filterForos.toUpperCase())){
          e.Visible=false
        }
      }
      if(this.EstadoPendiente==0 || this.EstadoPendiente==1){
        if(this.EstadoPendiente!=e.estadoAtendido){
          e.Visible=false
        }
      }
    });
  }
  IngresarForo(IdPGeneralForo:number,ContenidoCurso:boolean ){
    this.IdPGeneralForo=IdPGeneralForo;
    this.ContenidoCurso=ContenidoCurso;
  }

}
