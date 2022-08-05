import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-ayuda',
  templateUrl: './video-ayuda.component.html',
  styleUrls: ['./video-ayuda.component.scss']
})
export class VideoAyudaComponent implements OnInit {

  constructor() { }
  @Input() sise=4
  ngOnInit(): void {
  }

}
