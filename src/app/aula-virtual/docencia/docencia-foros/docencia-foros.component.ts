import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DocenciaForosModalComponent } from './docencia-foros-modal/docencia-foros-modal.component';

@Component({
  selector: 'app-docencia-foros',
  templateUrl: './docencia-foros.component.html',
  styleUrls: ['./docencia-foros.component.scss']
})
export class DocenciaForosComponent implements OnInit,OnChanges {

  constructor(public dialog: MatDialog) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.foros)
  }
  @Input() foros:any
  ngOnInit(): void {
  }
  OpenModal(e:any): void {
    const dialogRef = this.dialog.open(DocenciaForosModalComponent, {
      width: '900px',
      data: e,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
