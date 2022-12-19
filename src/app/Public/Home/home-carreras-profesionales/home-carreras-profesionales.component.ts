import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-home-carreras-profesionales',
  templateUrl: './home-carreras-profesionales.component.html',
  styleUrls: ['./home-carreras-profesionales.component.scss']
})
export class HomeCarrerasProfesionalesComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();

  constructor(
    private _HelperService :HelperService,
  ) { }
  public TituloCarreras = '';
  public Carreras: Array<BasicUrl> = [];

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    console.log('inicio')
    this._HelperService.recibirStringCarrera.pipe(takeUntil(this.signal$)).subscribe(
      x => {
        this.TituloCarreras=x
      });
    this._HelperService.recibirArrayCarrera.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.Carreras=x.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.Nombre,value:c.value,Url:c.Url};
          return ps;
        });
      }
    });
  }
  EventoInteraccionCarreras(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Más Información',Programa:nombre,Seccion:'Carreras Profesionales'})
  }

}
