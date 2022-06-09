import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocenciaForosModalComponent } from 'src/app/aula-virtual/docencia/docencia-foros/docencia-foros-modal/docencia-foros-modal.component';

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VistaPreviaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DocenciaForosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
