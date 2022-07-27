import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AutoEvaluacionService } from 'src/app/Core/Shared/Services/AutoEvaluacion/auto-evaluacion.service';

@Component({
  selector: 'app-docencia-gestion-autoevaluaciones',
  templateUrl: './docencia-gestion-autoevaluaciones.component.html',
  styleUrls: ['./docencia-gestion-autoevaluaciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaGestionAutoevaluacionesComponent implements OnInit,OnDestroy,OnChanges {

  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _AutoEvaluacionService:AutoEvaluacionService,
    public dialog: MatDialog,
  ) { }
  public AutoEv:any
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdProveedor>0){
      this.GenerarReporteFiltradoPortal()
    }
  }
  columnHeader = {
    nombre: 'Nombre',
    Acciones: 'Acciones',
  };

  TipoContenido: any = {
    Acciones: ['buttons', ['Editar','Eliminar','Descargar','Calificar']],
    //'Acciones': ['buttons'],
  };
  @Input() IdProveedor = 0;
  @Input() Correo = '';
  ngOnInit(): void {
  }
  GenerarReporteFiltradoPortal(){
    this._AutoEvaluacionService.GenerarReporteFiltradoPortal(this.IdProveedor.toString()).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.AutoEv=x
        this.AutoEv.forEach((a:any) => {
          a.RegistroEv=[];
        });
      }
    })
  }
  openTab(item:any,index:number){
    console.log(item)
    this._AutoEvaluacionService.ObtenerAutoEvaluacionPrograma(item.idPGeneral,item.idPEspecificoHijo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.AutoEv[index].RegistroEv=x
      }
    })
  }
  ButtonsClick(button:any){
    console.log(button)
  }
  OpenBanco(){

  }
}
