import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-carreras',
  templateUrl: './modal-carreras.component.html',
  styleUrls: ['./modal-carreras.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCarrerasComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalCarrerasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
