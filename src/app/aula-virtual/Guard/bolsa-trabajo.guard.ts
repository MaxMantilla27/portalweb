import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BolsaTrabajoGuard implements CanActivate {

  constructor(
    private _SessionStorageService: SessionStorageService,
    private router: Router,
  ){

  }
  canActivate( route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // if(typeof isCarrera != "boolean" || isCarrera==false ){
    //   this.router.navigate(['/AulaVirtual/Docencia']);
    //   return false;
    // }
    return true;
  }
}
