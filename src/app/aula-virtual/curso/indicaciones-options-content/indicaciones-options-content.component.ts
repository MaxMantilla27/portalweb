import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicaciones-options-content',
  templateUrl: './indicaciones-options-content.component.html',
  styleUrls: ['./indicaciones-options-content.component.scss']
})
export class IndicacionesOptionsContentComponent implements OnInit {

  constructor() { }

  @Input() title=''
  @Input() videoUrl=''
  @Input() TitlePrograma=''
  ngOnInit(): void {
  }

}
