
import { isPlatformBrowser } from '@angular/common';
import { Component , Inject, OnInit, PLATFORM_ID} from '@angular/core';
declare const fbq:any;

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {

  isBrowser: boolean;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
  ) {

    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    if(this.isBrowser){
      console.log(fbq)
      fbq('track', 'PageView');
    }
  }
}
