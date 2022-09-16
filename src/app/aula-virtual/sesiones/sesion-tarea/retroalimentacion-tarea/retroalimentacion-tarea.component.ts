import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-retroalimentacion-tarea',
  templateUrl: './retroalimentacion-tarea.component.html',
  styleUrls: ['./retroalimentacion-tarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RetroalimentacionTareaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RetroalimentacionTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
