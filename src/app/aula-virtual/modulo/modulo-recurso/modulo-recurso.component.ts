import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MaterialAdicionalService } from 'src/app/Core/Shared/Services/MaterialAdicional/material-adicional.service';

@Component({
  selector: 'app-modulo-recurso',
  templateUrl: './modulo-recurso.component.html',
  styleUrls: ['./modulo-recurso.component.scss']
})
export class ModuloRecursoComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _MaterialAdicionalService:MaterialAdicionalService,
    private _HelperService:HelperService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() Estructura:any=[]
  @Input() Capitulo='';
  @Input() idPGeneral=0;
  @Input() idPEspecifico=0;
  @Input() tipo=0;
  public material:any
  public miPerfil:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.miPerfil=x
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.tipo!=0){
      console.log(this.tipo)
      if(this.tipo==1){
        this.MaterialAdicionalAonline()
      }
      if(this.tipo!=1){
        this.MaterialAdicionalOnline()
      }
    }

  }
  //asincronica
  MaterialAdicionalAonline(){
    this._MaterialAdicionalService.MaterialAdicionalAonline(this.idPGeneral).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.material=x
      }
    })
  }
  //sincronica
  MaterialAdicionalOnline(){
    this._MaterialAdicionalService.MaterialAdicionalOnline(this.idPGeneral,this.idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.material=x
      }
    })
  }
  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Programa:this.Capitulo,Seccion:'Recursos'})
  }
}
