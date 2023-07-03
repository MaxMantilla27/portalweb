import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notificacion-bolivia',
  templateUrl: './notificacion-bolivia.component.html',
  styleUrls: ['./notificacion-bolivia.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificacionBoliviaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotificacionBoliviaComponent>,
    ) { }

  ngOnInit(): void {
  }

}
