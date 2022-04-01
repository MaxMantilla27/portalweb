import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private _SessionStorageService: SessionStorageService,private _location: Location, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (this._SessionStorageService.validateTokken()) {
      if(this._location.path().toString()!=state.url.toString()){
        this.router.navigate([this._location.path().toString()]);
      }else{
        this._location.back()
      }
      return false;
    }
    return true;
  }

}
