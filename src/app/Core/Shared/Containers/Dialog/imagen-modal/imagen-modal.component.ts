import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imagen-modal',
  templateUrl: './imagen-modal.component.html',
  styleUrls: ['./imagen-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImagenModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImagenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

}
