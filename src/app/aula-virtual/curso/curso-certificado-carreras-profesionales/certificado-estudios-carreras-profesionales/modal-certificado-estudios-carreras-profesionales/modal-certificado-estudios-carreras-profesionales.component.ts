import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Core/Models/Dialog';

@Component({
  selector: 'app-modal-certificado-estudios-carreras-profesionales',
  templateUrl: './modal-certificado-estudios-carreras-profesionales.component.html',
  styleUrls: ['./modal-certificado-estudios-carreras-profesionales.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCertificadoEstudiosCarrerasProfesionalesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalCertificadoEstudiosCarrerasProfesionalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel
  ) { }
  ngOnInit(): void {
  }

}
