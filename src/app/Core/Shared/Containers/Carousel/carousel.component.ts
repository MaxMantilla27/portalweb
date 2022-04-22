import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BasicCarousel, BasicUrl } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit {

  constructor() { }

  @Input() html:boolean=true;
  @Input() images:Array<BasicCarousel>=[];

  ngOnInit(): void {
  }

}
