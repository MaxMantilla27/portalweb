import { Component, Input, OnInit } from '@angular/core';
import { ModalTrabajoAplicacionProfesionalComponent } from './modal-trabajo-aplicacion-profesional/modal-trabajo-aplicacion-profesional.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-curso-trabajo-aplicacion-profesional',
  templateUrl: './curso-trabajo-aplicacion-profesional.component.html',
  styleUrls: ['./curso-trabajo-aplicacion-profesional.component.scss']
})
export class CursoTrabajoAplicacionProfesionalComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private _ProgramaContenidoService: ProgramaContenidoService,

  ) { }
  @Input() IdMatricula=0;
  @Input() idPGeneral=0;
  @Input() TrabajoAplicacionProfesional:any
  public fechaSelec=new Date()

  ngOnInit(): void {
    this.ObtenerTrabajoAplicacionProfesional();
  }

  ObtenerTrabajoAplicacionProfesional(){
    this._ProgramaContenidoService.ObtenerTrabajoAplicacionProfesional(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TrabajoAplicacionProfesional=x;
        this.fechaSelec=x.fechaEntrega

      },
      complete:()=>{

      }
    })
  }
  EnviarProyectoAplicacionProfesional(data:any){
    const dialogRef = this.dialog.open(ModalTrabajoAplicacionProfesionalComponent, {
      data: data,
      panelClass: 'modal-trabajo-aplicacion-carreras-profesionales-container',
      disableClose:true
    });
    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){

      }
    });
  }

}
