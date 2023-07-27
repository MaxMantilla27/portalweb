import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-word',
  templateUrl: './change-word.component.html',
  styleUrls: ['./change-word.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangeWordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChangeWordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
  }

  cerrar(){
    this.dialogRef.close(this.data.word);
  }
}
