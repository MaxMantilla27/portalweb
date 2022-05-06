import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { HelperService } from '../Core/Shared/Services/helper.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  isBrowser: boolean;
  constructor(
    private _HelperService: HelperService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {}
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
