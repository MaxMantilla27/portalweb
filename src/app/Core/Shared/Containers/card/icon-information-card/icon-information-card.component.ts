import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon-information-card',
  templateUrl: './icon-information-card.component.html',
  styleUrls: ['./icon-information-card.component.scss']
})
export class IconInformationCardComponent implements OnInit {

  @Input()
  item: any = {}
  constructor() { }

  ngOnInit(): void {
  }

}
