import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  isBrowser: boolean;
  constructor(private _SessionStorageService: SessionStorageService,private _location: Location, private router: Router, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if(this.isBrowser){
      if (this._SessionStorageService.validateTokken()) {
        if(this._location.path().toString()!=state.url.toString()){
          this.router.navigate([this._location.path().toString()]);
        }else{
          this.router.navigate(['AulaVirtual/MiPerfil']);
        }
        return false;
      }
    }
    return true;
  }

}
