import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-modulo-ayuda',
  templateUrl: './modulo-ayuda.component.html',
  styleUrls: ['./modulo-ayuda.component.scss']
})
export class ModuloAyudaComponent implements OnInit {

  constructor(
    private _HelperService : HelperService
  ) { }
  @Input() IdMatriculaCabecera=0
  @Input() Capitulo=''
  @Input() IdPGeneral = 0;
  @Input() IdPrincipal = 0;
  @Input() IdPEspecifico =0;
  public miPerfil:any
  public preguntasFrecuentes= false;
  public quejasSugerencias=false;

  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {
      this.miPerfil=x
    })
  }
  RefrescarAyuda(){
    this.preguntasFrecuentes=false;
    this.quejasSugerencias=false;
  }

}
