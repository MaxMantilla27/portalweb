import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-home-educacion-tecnica',
  templateUrl: './home-educacion-tecnica.component.html',
  styleUrls: ['./home-educacion-tecnica.component.scss']
})
export class HomeEducacionTecnicaComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();

  constructor(
    private _HelperService :HelperService,
  ) { }
  public TituloEducacion = '';
  public Educacion: Array<BasicUrl> = [];

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    this._HelperService.recibirStringEducacion.pipe(takeUntil(this.signal$)).subscribe(
      x => {
      this.TituloEducacion=x
    });
    this._HelperService.recibirArrayEducacion.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.Educacion=x.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.Nombre,value:c.value,Url:c.Url};
          return ps;
        });
      }
    });
  }
  EventoInteraccionEducacion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Más Información',Programa:nombre,Seccion:'Educación Técnica'})
  }
}
