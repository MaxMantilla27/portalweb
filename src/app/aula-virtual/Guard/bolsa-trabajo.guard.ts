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
    let isCarrera = this._SessionStorageService.SessionGetValue('TipoCarrera');
    if (isCarrera && isCarrera.length > 1) {
      if (isCarrera == "true") return true;
    }
    this.router.navigate(['/AulaVirtual/MisCursos']);
    return false;
  }
}
