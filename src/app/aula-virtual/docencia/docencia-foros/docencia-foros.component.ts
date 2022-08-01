import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DocenciaForosModalComponent } from './docencia-foros-modal/docencia-foros-modal.component';

@Component({
  selector: 'app-docencia-foros',
  templateUrl: './docencia-foros.component.html',
  styleUrls: ['./docencia-foros.component.scss']
})
export class DocenciaForosComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(public dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
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

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
