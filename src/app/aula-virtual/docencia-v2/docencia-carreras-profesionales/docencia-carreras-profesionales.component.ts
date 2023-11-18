import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-docencia-carreras-profesionales',
  templateUrl: './docencia-carreras-profesionales.component.html',
  styleUrls: ['./docencia-carreras-profesionales.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaCarrerasProfesionalesComponent implements OnInit ,OnDestroy {
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
  public TerminaCarga=false;
  @Output() AddIndex = new EventEmitter<any>();
  ngOnInit(): void {
    this.ObtenerCarreraProvedor()
  }
  ObtenerCarreraProvedor(){
    this._DatosPerfilService.ObtenerCarreraProvedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=true;
        this.Cursos=x
        console.log(this.Cursos)
        if(this.Cursos!=null){
          this.Cursos.forEach((c:any) => {
            c.Visible=true
            if(c.cursos!=null){
              c.cursos.forEach((cc:any) => {
                cc.Visible=true
                if(cc.orden==0 && cc.sesionesFaltantes!=null && cc.sesionesFaltantes>0){
                  cc.porcentage=cc.sesiones*100/cc.sesionesFaltantes
                }
              });
            }
          });
        }
      }
    })
  }

  FilterCursos(){
    this.Cursos.forEach((e:any) => {
      e.Visible=true
      var visibles=0
      e.cursos.forEach((cc:any) => {
        cc.Visible=true
        if(this.filterCurso.length>0){
          var name=cc.pGeneral.toUpperCase();
          if(!name.includes(this.filterCurso.toUpperCase())){
            cc.Visible=false
          }else{
            visibles++
          }
        }
      });
      if(visibles==0 && this.filterCurso.length>0){
        e.Visible=false
      }
    });
  }
  saveIndex(index:number){
    this._SessionStorageService.SessionSetValue('cursoOnlineCursoIndex',index.toString());
  }
  IrTrabajo(item:any,nombre:any){
    console.log(item)
    item.NombrePadre=nombre
    this.AddIndex.emit(item)
  }
}
