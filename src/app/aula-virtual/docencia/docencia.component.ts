import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';
import { ReporteParticipacionExpositorService } from 'src/app/Core/Shared/Services/ReporteParticipacionExpositor/reporte-participacion-expositor.service';
import { PerfilalumnosService } from 'src/app/Core/Shared/Services/PerfilAlumnos/perfilalumnos.service';
@Component({
  selector: 'app-docencia',
  templateUrl: './docencia.component.html',
  styleUrls: ['./docencia.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _ProveedorService:ProveedorService,
    public _ReporteParticipacionExpositorService: ReporteParticipacionExpositorService,
    public _PerfilAlumnosService: PerfilalumnosService,
  ) { }

  public migaPan = [
    {
      titulo: 'Docencia',
      urlWeb: '/AulaVirtual/Docencia',
    }
  ];
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
  public tabIndex = 0;
  public hide=true
  public DataProveedor:any
  public dataForo:any
  public notas:any
  public PerfilAlumnos:any
  ngOnInit(): void {
    this.ObtenerInformacionProveedor();
    this.ObtenerForoProveedor();
    // this.ObtenerPerfilAlumnos();
  }
  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.DataProveedor=x

        this.json.IdProveedorOperaciones = this.DataProveedor.id.toString();
        this.GenerarReporteFiltradoPortal()
      }
    })
  }
  ObtenerForoProveedor(){
    this._ProveedorService.ObtenerForoProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.dataForo=x
      }
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {

  }

  GenerarReporteFiltradoPortal() {
    this._ReporteParticipacionExpositorService
      .GenerarReporteFiltradoPortal(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.notas = x;
          console.log(x);
        },
      });
  }

  // ObtenerPerfilAlumnos(){
  //   this._PerfilAlumnosService.ObtenerPerfilAlumnos(18675).pipe(takeUntil(this.signal$)).subscribe({
  //     next:x=>{
  //       this.PerfilAlumnos=x;
  //       console.log(this.PerfilAlumnos);
  //       console.log("Hola");
  //     }
  //   })
  // }
}
