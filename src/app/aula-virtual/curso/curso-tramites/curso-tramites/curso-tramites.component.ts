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
  public ConceptoPago='';
  public MontoDetalle=0;
  public AgregarDetallePagar=false;
  public TotalTramitesCurso:Array<any>=[];
  public TramitesCurso:Array<any>=[];
  public PagoTotalTramite=0;

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
        console.log(this.TramitesCurso)
      }
    })
  }
  CalcularMontoTotal(){
    this.TramitesCurso.forEach((y:any)=>{
      if(y.pagar==true){
        this.PagoTotalTramite=this.PagoTotalTramite+y.tarifario;
        console.log(this.PagoTotalTramite)
      }
    })
  }
  /* cambiarEstadoPago(i:number){
    this.TotalTramitesCurso[i].forEach((y:any)=>{
      console.log(y)
      if(y==i){
        if(y.pagar==true){
          y.pagar=false;
        }
        if(y.pagar==false){
          y.pagar=true;
        }
      }
    })
  } */
}
