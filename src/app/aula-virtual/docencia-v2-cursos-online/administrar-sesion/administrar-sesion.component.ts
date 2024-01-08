import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { RegistrarAsistenciaOnlineComponent } from './registrar-asistencia-online/registrar-asistencia-online.component';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-administrar-sesion',
  templateUrl: './administrar-sesion.component.html',
  styleUrls: ['./administrar-sesion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdministrarSesionComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _DatosPerfilService: DatosPerfilService,
    private _ActivatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _SessionStorageService: SessionStorageService
  ) {}
  public IdPespecifico = 0;
  public sesiones: any;
  public IdSesion = 0;
  @Input() DataProveedor: any;
  public sesion: any;
  public OpenAgendaSesion = false;
  public OpenActividadesSesion = false;
  public OpenInteractividadSesion = false;
  public loadingSesiones = false;
  public fechaFinSesion:any
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.IdPespecifico = parseInt(x['IdPespecifico']);
        this.ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(
          this.IdPespecifico
        );
      },
    });
  }
  ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(IdPespecifico: number) {
    this.loadingSesiones = false;
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.loadingSesiones = true;
          this.sesiones = x;
          console.log(this.sesiones);
          if (
            this.sesiones != undefined &&
            this.sesiones != null &&
            this.sesiones.length > 0
          ) {
            var idses =
              this._SessionStorageService.SessionGetValue('SesionSelect');
            if (idses != '') {
              this.sesiones.forEach((s: any) => {
                if (s.orden == parseInt(idses)) {
                  this.IdSesion = s.idSesion;
                  this.sesion = s;
                }
                this.fechaFinSesion=s.fechaSesion
              });
            }

            if (this.IdSesion == 0) {
              this.sesiones.forEach((s: any) => {
                if (this.IdSesion == 0) {
                  if (s.esVisible == true) {
                    this.IdSesion = s.idSesion;
                    this.sesion = s;
                  }
                }
                this.fechaFinSesion=s.fechaSesion
              });
              if (this.IdSesion == 0) {
                this.IdSesion =
                  this.sesiones[this.sesiones.length - 1].idSesion;
                this.sesion = this.sesiones[this.sesiones.length - 1];
              }
            }
          }
        },
      });
  }
  ObtnerDataSesion() {
    this.sesiones.forEach((s: any) => {
      if (s.idSesion == this.IdSesion) {
        console.log(s);
        this.sesion = s;
      }
      this.fechaFinSesion=s.fechaSesion
    });
  }

  OpenAsistencias() {
    this.sesiones.forEach((s: any) => {
      if (s.idSesion == this.IdSesion) {
        this.sesion = s;
      }
    });
    const dialogRef = this.dialog.open(RegistrarAsistenciaOnlineComponent, {
      width: '1000px',
      data: {
        IdPespecifico: this.IdPespecifico,
        IdSesion: this.IdSesion,
        Sesion: this.sesion,
        correo: this.DataProveedor.email,
      },
      panelClass: 'dialog-Tarjeta',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.signal$))
      .subscribe((result) => {
        if (result != undefined) {
        }
      });
  }
}
