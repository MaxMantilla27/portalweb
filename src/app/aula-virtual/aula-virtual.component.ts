import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelperService } from '../Core/Shared/Services/helper.service';

@Component({
  selector: 'app-aula-virtual',
  templateUrl: './aula-virtual.component.html',
  styleUrls: ['./aula-virtual.component.scss']
})
export class AulaVirtualComponent implements OnInit {

  isBrowser: boolean;
  constructor(

    private _HelperService: HelperService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(this.isBrowser){
          document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
        }
      }
    });
  }
  onSideNavScroll(event: any) {
    this._HelperService.enviarScroll(event.target.scrollTop);
  }
}
