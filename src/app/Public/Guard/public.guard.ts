import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  isBrowser: boolean;
  constructor(private _SessionStorageService: SessionStorageService,private _location: Location, private router: Router, @Inject(PLATFORM_ID) platformId: Object,
  private _HelperService: HelperService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if(this.isBrowser){
      if (this._SessionStorageService.validateTokken()) {

        this.DatoObservable.datoAvatar=true
        this.DatoObservable.datoContenido=true
        this._HelperService.enviarDatoCuenta(this.DatoObservable)
        console.log(this.DatoObservable);
        this.router.navigate(['AulaVirtual/MisCursos']);
        return false;
      }
    }
    return true;
  }

}
