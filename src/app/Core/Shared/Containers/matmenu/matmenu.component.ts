import { Component, Input, OnInit } from '@angular/core';
import { BasicUrl } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-matmenu',
  templateUrl: './matmenu.component.html',
  styleUrls: ['./matmenu.component.scss']
})
export class MatmenuComponent implements OnInit {

  constructor() { }

  @Input() dataUrl:Array<BasicUrl>=[];
  ngOnInit(): void {
  }

}
