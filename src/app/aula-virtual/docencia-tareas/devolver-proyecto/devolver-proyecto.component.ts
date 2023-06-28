import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DevolverProyectoDTO } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';

@Component({
  selector: 'app-devolver-proyecto',
  templateUrl: './devolver-proyecto.component.html',
  styleUrls: ['./devolver-proyecto.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DevolverProyectoComponent implements OnInit {
  private signal$ = new Subject();
  public json:DevolverProyectoDTO={
    Id:0,
    Motivo:''
  }

  constructor(
    public dialogRef: MatDialogRef<DevolverProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _TareaEvaluacionService:TareaEvaluacionService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.json.Id=this.data.id
  }
  DevolverProyecto(){
    this._TareaEvaluacionService.DevolverProyecto(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.dialogRef.close(true);
      },
      error:x=>{
        this.dialogRef.close(undefined);
      }
    })
  }
}
