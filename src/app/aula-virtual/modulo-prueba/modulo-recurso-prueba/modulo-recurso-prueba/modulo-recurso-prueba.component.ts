import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MaterialAdicionalService } from 'src/app/Core/Shared/Services/MaterialAdicional/material-adicional.service';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';

@Component({
  selector: 'app-modulo-recurso-prueba',
  templateUrl: './modulo-recurso-prueba.component.html',
  styleUrls: ['./modulo-recurso-prueba.component.scss']
})
export class ModuloRecursoPruebaComponent implements OnInit {

  constructor(
    private _MaterialAdicionalService:MaterialAdicionalService,
    private _HelperService:HelperService,
    private _VideoSesionService:VideoSesionService,
  ) { }

  @Input() Estructura:any=[]
  @Input() Capitulo='';
  @Input() idPGeneral=0;
  @Input() idPEspecifico=0;
  @Input() tipo=0;
  public material:any
  public miPerfil:any
  public Diapositivas:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {
      this.miPerfil=x
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.tipo!=0){
      console.log(this.Estructura)
      this.ObtenerDiapositivas();
    }

  }
  ObtenerDiapositivas(){
    this._VideoSesionService.ObtenerConfiguracionVideoSesion(this.idPGeneral,1).subscribe((x)=>{
      this.Diapositivas=x;
      console.log()
    })
  }
}
