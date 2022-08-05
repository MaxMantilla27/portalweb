import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-curso-simuladores',
  templateUrl: './curso-simuladores.component.html',
  styleUrls: ['./curso-simuladores.component.scss']
})
export class CursoSimuladoresComponent implements OnInit,OnDestroy,OnChanges {

  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService:DatosPerfilService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
      this.ListaSimuladorAsignadoMatriculado();
    }
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public simuladores:any
  ngOnInit(): void {
  }
  ListaSimuladorAsignadoMatriculado(){
    this._DatosPerfilService.ListaSimuladorAsignadoMatriculado(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.simuladores=x
      },
      error:e=>{
        console.log(e)
      }
    })
  }
  Ir(url:string){
    window.open(url, "_blank");
  }
}
