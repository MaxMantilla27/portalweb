import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';

@Component({
  selector: 'app-docencia-v2',
  templateUrl: './docencia-v2.component.html',
  styleUrls: ['./docencia-v2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaV2Component implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _ProveedorService:ProveedorService,
    ) { }

  public migaPan = [
    {
      titulo: 'DocenciaV2',
      urlWeb: '/AulaVirtual/Docencia',
    }
  ];
  public hide=false
  public tabIndex = 1;
  public DataProveedor:any

  public json: ParticipacionExpositorFiltroDTO = {
    IdArea: null,
    IdCentroCosto: null,
    IdCodigoBSCiudad: null,
    IdEstadoPEspecifico: '1,2,3,5',
    IdModalidadCurso: null,
    IdPGeneral: null,
    IdProgramaEspecifico: null,
    IdProveedorOperaciones: '',
    IdSubArea: null,
    IdCentroCostoD: 0,
    SinNotaAprobada: true,
    SinAsistenciaAprobada:null
  };
  ngOnInit(): void {
    this.ObtenerInformacionProveedor();
  }

  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.DataProveedor=x

        this.json.IdProveedorOperaciones = this.DataProveedor.id.toString();
        // this.GenerarReporteFiltradoPortal()
      }
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {

  }
}
