import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-docencia-v2',
  templateUrl: './docencia-v2.component.html',
  styleUrls: ['./docencia-v2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaV2Component implements OnInit {

  constructor() { }

  public migaPan = [
    {
      titulo: 'Docencia',
      urlWeb: '/AulaVirtual/Docencia',
    }
  ];
  public hide=false
  public tabIndex = 0;
  ngOnInit(): void {
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {

  }
}
