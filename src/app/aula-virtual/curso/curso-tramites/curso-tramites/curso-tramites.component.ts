import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-curso-tramites',
  templateUrl: './curso-tramites.component.html',
  styleUrls: ['./curso-tramites.component.scss']
})
export class CursoTramitesComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService: DatosPerfilService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public TramitesCurso:Array<any>=[];
  public PagoTotalTramite=0;
  public SimboloMoneda='';
  public tramitesSolicitado:any
  public charge=false
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0 && !this.charge){
      this.ObtenerTramitesSolicitadosPorMatricula();
      this.CalcularMontoTotal();
      this.ObtenerTramitesMatricula()
    }
  }
  ObtenerTramitesSolicitadosPorMatricula(){
    this.charge=true
    this._DatosPerfilService.ObtenerTramitesSolicitadosPorMatricula(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.tramitesSolicitado=x;
      }
    })
  }
  ObtenerTramitesMatricula(){
    this._DatosPerfilService.ListaTramiteAdministrativoProgramaMatriculadoRegistrado(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
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
