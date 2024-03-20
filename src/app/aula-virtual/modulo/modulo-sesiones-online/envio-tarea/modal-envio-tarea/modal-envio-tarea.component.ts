import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-modal-envio-tarea',
  templateUrl: './modal-envio-tarea.component.html',
  styleUrls: ['./modal-envio-tarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalEnvioTareaComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<ModalEnvioTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }
  public Puntos=90
  ngOnInit(): void {
    this.Puntos=this.data.Puntos;
  }

}
