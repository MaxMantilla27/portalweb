import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Core/Models/Dialog';

@Component({
  selector: 'app-modal-certificado-titulo-carreras-profesionales',
  templateUrl: './modal-certificado-titulo-carreras-profesionales.component.html',
  styleUrls: ['./modal-certificado-titulo-carreras-profesionales.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ModalCertificadoTituloCarrerasProfesionalesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalCertificadoTituloCarrerasProfesionalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel
  ) { }
  ngOnInit(): void {
  }

}
