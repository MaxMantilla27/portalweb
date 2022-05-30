import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-curso-tramites',
  templateUrl: './curso-tramites.component.html',
  styleUrls: ['./curso-tramites.component.scss']
})
export class CursoTramitesComponent implements OnInit {

  constructor(
    private _DatosPerfilService: DatosPerfilService
  ) { }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public TramitesCurso:Array<any>=[];
  public PagoTotalTramite=0;
  public SimboloMoneda='';


  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
      this.ObtenerTramitesMatricula();
      this.CalcularMontoTotal();
    }
  }
  ObtenerTramitesMatricula(){
    this._DatosPerfilService.ListaTramiteAdministrativoProgramaMatriculadoRegistrado(this.IdMatricula).subscribe({
      next:x=>{
        this.TramitesCurso=x;
        this.TramitesCurso.forEach((y:any)=>{
          y.pagar=false;
        })
      }
    })
  }
  CalcularMontoTotal(){
    this.PagoTotalTramite=0;
    this.SimboloMoneda=''
    this.TramitesCurso.forEach((y:any)=>{
      if(y.pagar==true){
        this.PagoTotalTramite=this.PagoTotalTramite+y.tarifario;
        this.SimboloMoneda=y.simboloMoneda
      }
    })
  }
  cambiarEstadoPago(i:number){
    console.log(this.TramitesCurso[i].pagar)
    this.CalcularMontoTotal();
  }
}
