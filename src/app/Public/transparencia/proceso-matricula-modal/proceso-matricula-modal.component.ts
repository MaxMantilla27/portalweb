import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-proceso-matricula-modal',
  templateUrl: './proceso-matricula-modal.component.html',
  styleUrls: ['./proceso-matricula-modal.component.scss']
})
export class ProcesoMatriculaModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProcesoMatriculaModalComponent>,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
