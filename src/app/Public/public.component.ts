
import { Component , OnInit} from '@angular/core';
declare const fbq:any;

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  constructor(
  ) {
  }
  ngOnInit() {
    console.log(fbq)
    fbq('track', 'PageView');
  }
}
