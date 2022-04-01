import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AulaVirtualGuard implements CanActivate ,CanActivateChild {
  constructor(private _SessionStorageService: SessionStorageService,private _location: Location, private router: Router) {
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this._SessionStorageService.validateTokken()) {
      if(this._location.path().toString()!=state.url.toString()){
        this.router.navigate([this._location.path().toString()]);
      }else{
        this._location.back()
      }
      return false;
    }
    return true;
  }
  canActivate()
  {
    return true;
  }

}
