import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardMatriculasPruebaComponent } from 'src/app/Core/Shared/Containers/card/card-matriculas-prueba/card-matriculas-prueba/card-matriculas-prueba.component';

@Component({
  selector: 'app-vigencia-acceso-prueba',
  templateUrl: './vigencia-acceso-prueba.component.html',
  styleUrls: ['./vigencia-acceso-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VigenciaAccesoPruebaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CardMatriculasPruebaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
