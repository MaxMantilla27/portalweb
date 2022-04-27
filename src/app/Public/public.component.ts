import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { HelperService } from '../Core/Shared/Services/helper.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  constructor(private _HelperService: HelperService, private router: Router) {}
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        document.querySelector('.mat-sidenav-content')!.scrollTop = 0;
      }
    });
  }
  onSideNavScroll(event: any) {
    this._HelperService.enviarScroll(event.target.scrollTop);
  }
}
