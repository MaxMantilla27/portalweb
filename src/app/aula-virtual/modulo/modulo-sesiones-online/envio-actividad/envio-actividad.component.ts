import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-envio-actividad',
  templateUrl: './envio-actividad.component.html',
  styleUrls: ['./envio-actividad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioActividadComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<EnvioActividadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,

  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    console.log(this.data)
  }



}
