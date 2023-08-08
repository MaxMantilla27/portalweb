import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';

@Component({
  selector: 'app-docencia-v2-cursos-online',
  templateUrl: './docencia-v2-cursos-online.component.html',
  styleUrls: ['./docencia-v2-cursos-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaV2CursosOnlineComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _DatosPerfilService:DatosPerfilService,
    private _ActivatedRoute: ActivatedRoute,
    private _ProveedorService:ProveedorService,
  ) { }

  public migaPan = [
    {
      titulo: 'DocenciaV2',
      urlWeb: '/AulaVirtual/DocenciaV2',
    }
  ];
  public hide=false
  public tabIndex = 0;
  public IdPespecifico=0;
  public curso:any

  public DataProveedor:any
  ngOnInit(): void {
    this.ObtenerInformacionProveedor();
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.IdPespecifico = parseInt(x['IdPespecifico']);

        this.ObtenerCursoOnlineWebinarDocentePortalWeb();
      },
    });
  }
  ObtenerCursoOnlineWebinarDocentePortalWeb(){
    this._DatosPerfilService.ObtenerCursoOnlineWebinarDocentePortalWeb(this.IdPespecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.curso=x

        this.migaPan.push(
          {
            titulo: this.curso.cursoNombre,
            urlWeb: '/AulaVirtual/DocenciaV2/'+this.IdPespecifico,
          },)
      }
    })
  }

  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.DataProveedor=x
        // this.GenerarReporteFiltradoPortal()
      }
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {

  }
}
