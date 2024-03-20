import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoGuard implements CanActivate {
  constructor(
    private _SessionStorageService: SessionStorageService,
    private router: Router,
  ){

  }
  canActivate( route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var idProveedor=this._SessionStorageService.SessionGetValue('IdProveedor')
    var cursos=this._SessionStorageService.SessionGetValue('Cursos')
    if((idProveedor!='' && parseInt(idProveedor)>0) && (cursos=='' || parseInt(cursos)==0) ){

      this.router.navigate(['/AulaVirtual/DocenciaV2']);
      return false;
    }
    return true;
  }

}
