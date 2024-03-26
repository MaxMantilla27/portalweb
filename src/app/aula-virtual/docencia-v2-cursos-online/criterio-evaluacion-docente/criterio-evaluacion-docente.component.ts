import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { MatDialog } from '@angular/material/dialog';
import { DocenciaGestionCriteriosRegistroAntiguoComponent } from './docencia-gestion-criterios-registro-antiguo/docencia-gestion-criterios-registro-antiguo.component';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';

@Component({
  selector: 'app-criterio-evaluacion-docente',
  templateUrl: './criterio-evaluacion-docente.component.html',
  styleUrls: ['./criterio-evaluacion-docente.component.scss']
})
export class CriterioEvaluacionDocenteComponent implements OnInit ,OnChanges, OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() IdPespecifico = 0;
  constructor(
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public dialog: MatDialog,
    private _ProveedorService:ProveedorService,


    ) { }

  ngOnInit(): void {
  }

  columnHeader:any = {
    indice: 'N°',
    nombre: 'Criterio',
    procentaje: 'Porcentaje Asignado'
  };
  TipoContenido: any = {
    //'Acciones': ['buttons'],
  };
  public criterios:any
  public RegistrarCriterios=false;
  public DataProveedor:any
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPespecifico != 0) {
      this.ObtenerCriteriosPorProgramaEspecifico();
      this.ObtenerInformacionProveedor();
    }
  }
  ObtenerCriteriosPorProgramaEspecifico(){
    this._PEspecificoEsquemaService.ObtenerCriteriosPorProgramaEspecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x!=null){
          this.criterios=x
          if(this.criterios!=null){
            let i=1
            this.criterios.forEach((c:any) => {
              c.procentaje=c.ponderacion+'%'
              c.indice=i
              i++
            });
          }
        }
        else{
          this.ObtenerCriteriosPorProgramaEspecificoAntiguos()
        }
      },
    });
  }
  ObtenerCriteriosPorProgramaEspecificoAntiguos(){
    this._PEspecificoEsquemaService.ObtenerCriteriosPorProgramaEspecificoAntiguos(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.RegistrarCriterios=true;
        console.log(x);
        if(x!=null){
          this.criterios=x
          if(this.criterios!=null){
            let i=1
            this.criterios.forEach((c:any) => {
              c.procentaje=c.ponderacion+'%'
              c.indice=i
              i++
            });
          }
        }
        else{
          this.criterios=undefined;
        }
      },
    });
  }
  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.DataProveedor=x
      }
    })
  }
  RegistrarCriteriosAntiguos(){
    const dialogRef = this.dialog.open(DocenciaGestionCriteriosRegistroAntiguoComponent, {
      width: '1000px',
      data: {
        grupo:1,
        IdPEspecifico:this.IdPespecifico,
        correo:this.DataProveedor.email,
        idProveedor:this.DataProveedor.id},
      panelClass: 'custom-dialog-docencia-gestion-criterios-antiguos-container',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      this.ObtenerCriteriosPorProgramaEspecifico();
    });
  }
}
