import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-modulo-ayuda',
  templateUrl: './modulo-ayuda.component.html',
  styleUrls: ['./modulo-ayuda.component.scss']
})
export class ModuloAyudaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _HelperService : HelperService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() IdMatriculaCabecera=0
  @Input() Capitulo=''
  @Input() IdPGeneral = 0;
  @Input() IdPrincipal = 0;
  @Input() IdPEspecifico =0;
  @Output() OnChange = new EventEmitter<number>();
  public miPerfil:any
  public preguntasFrecuentes= false;
  public quejasSugerencias=false;

  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.miPerfil=x
    })
  }
  RefrescarAyuda(){
    this.preguntasFrecuentes=false;
    this.quejasSugerencias=false;
  }

  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Ayuda'})
  }
}
