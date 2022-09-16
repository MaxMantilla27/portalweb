import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-charge-text',
  templateUrl: './charge-text.component.html',
  styleUrls: ['./charge-text.component.scss']
})
export class ChargeTextComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChargeTextComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
