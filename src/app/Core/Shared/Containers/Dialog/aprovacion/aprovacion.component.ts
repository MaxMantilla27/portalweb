import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Core/Models/Dialog';

@Component({
  selector: 'app-aprovacion',
  templateUrl: './aprovacion.component.html',
  styleUrls: ['./aprovacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AprovacionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AprovacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel
  ) {}

  ngOnInit(): void {
    console.log(this.data)
  }
}
