import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgramasDetalleComponent } from '../programas-detalle.component';

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VistaPreviaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProgramasDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  source: string = '';
  ejct(e:any){
    this.source = e.contentWindow.location.href;
    console.log(e)
    console.log(this.source)
  }
}
