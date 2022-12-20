import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent implements OnInit {
  isBrowser: boolean;
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(e:any) {
    if(this.isBrowser){
      this.scroll=document.documentElement.scrollTop
    }
  }
  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  @Input() ScrollInit=100;
  public scroll=0
  ngOnInit(): void {
  }
  ScrollUP(){
    document.documentElement.scrollTop=0;
    console.log(document.documentElement.scrollTop )
  }
}
