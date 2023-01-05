import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MaterialAdicionalService } from 'src/app/Core/Shared/Services/MaterialAdicional/material-adicional.service';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';

@Component({
  selector: 'app-modulo-recurso-prueba',
  templateUrl: './modulo-recurso-prueba.component.html',
  styleUrls: ['./modulo-recurso-prueba.component.scss']
})
export class ModuloRecursoPruebaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _MaterialAdicionalService:MaterialAdicionalService,
    private _HelperService:HelperService,
    private _VideoSesionService:VideoSesionService,
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
  public Diapositivas:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.miPerfil=x
    })
    console.log(this.Estructura)

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.tipo!=0){
      console.log(this.Estructura)
      this.ObtenerDiapositivas();
    }

  }
  ObtenerDiapositivas(){
    this._VideoSesionService.ObtenerConfiguracionVideoSesion(this.idPGeneral,1).pipe(takeUntil(this.signal$)).subscribe((x)=>{
      this.Diapositivas=x;
    })
  }
  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Programa:this.Capitulo,Seccion:'Recursos'})
  }
}
