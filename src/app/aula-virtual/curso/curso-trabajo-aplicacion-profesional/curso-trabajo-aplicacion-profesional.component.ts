import { Component, Input, OnInit } from '@angular/core';
import { ModalTrabajoAplicacionProfesionalComponent } from './modal-trabajo-aplicacion-profesional/modal-trabajo-aplicacion-profesional.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-curso-trabajo-aplicacion-profesional',
  templateUrl: './curso-trabajo-aplicacion-profesional.component.html',
  styleUrls: ['./curso-trabajo-aplicacion-profesional.component.scss']
})
export class CursoTrabajoAplicacionProfesionalComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    public dialog: MatDialog,
  ) { }
  @Input() IdMatricula=0;
  @Input() idPGeneral=0;
  ngOnInit(): void {
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
