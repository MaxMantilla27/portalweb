import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioProgressiveProfilingService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'FormularioProgresivo';
  private intervaloTiempoLocal: any = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerListaFormularioProgresivo():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerListaFormularioProgresivo');
    }else{
      return EMPTY;
    }
  }

  public iniciarContador(tiempoSesion: number): void {
    this.detenerContador();
    localStorage.setItem('tiempoformularioProgresivo', JSON.stringify(tiempoSesion));
    this.intervaloTiempoLocal = setInterval(() => {
      tiempoSesion -= 1;
      localStorage.setItem('tiempoformularioProgresivo', JSON.stringify(tiempoSesion));
      if (tiempoSesion < 0) {
        this.detenerContador();
        console.log('Contador finalizado');
      }
    }, 1000);
    console.log('Contador iniciado con:', tiempoSesion);
  }

  public detenerContador(): void {
    clearInterval(this.intervaloTiempoLocal);
    this.intervaloTiempoLocal = null;
    localStorage.removeItem('tiempoformularioProgresivo');
    console.log('Contador detenido');
  }

}
