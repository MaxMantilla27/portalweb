import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lineamientos-tarea-online',
  templateUrl: './lineamientos-tarea-online.component.html',
  styleUrls: ['./lineamientos-tarea-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LineamientosTareaOnlineComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LineamientosTareaOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit(): void {
  }

}
