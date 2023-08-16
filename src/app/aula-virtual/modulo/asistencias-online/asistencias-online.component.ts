import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Subject, takeUntil } from 'rxjs';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-asistencias-online',
  templateUrl: './asistencias-online.component.html',
  styleUrls: ['./asistencias-online.component.scss'],
})
export class AsistenciasOnlineComponent
  implements OnInit, OnDestroy, OnChanges
{
  private signal$ = new Subject();

  constructor(
    private _AsistenciaService: AsistenciaService,
    private _DatosPerfilService: DatosPerfilService
  ) {}

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() border=true
  @Input() IdMatriculaCabecera = 0;
  @Input() IdPEspecifico = 0;
  public asistenciaAlumno: any;
  public sesion = 0;
  public sesionesAll: any;
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdMatriculaCabecera != 0) {
      this.ObtenerSesionesOnlineWebinarPorIdPespecifico();
    }
  }
  ObtenerAsistencia() {
    this._AsistenciaService
      .ObtenerAsistencia(this.IdMatriculaCabecera, this.IdPEspecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.asistenciaAlumno = x;
          if (
            this.sesionesAll != null &&
            this.sesionesAll != undefined &&
            this.sesionesAll.length > 0
          ) {
            if (
              this.asistenciaAlumno != null &&
              this.asistenciaAlumno != undefined &&
              this.asistenciaAlumno.length > 0
            ) {
              this.sesionesAll.forEach((s: any) => {
                this.asistenciaAlumno.forEach((a: any) => {
                  if (s.idSesion == a.idPEspecificoSesion) {
                    s.existe = true;
                  }
                });
              });
              this.sesionesAll.forEach((s: any) => {
                if (s.existe != true) {
                  this.asistenciaAlumno.push({
                    asistio: null,
                    fechaHoraInicio: s.fechaHoraInicio,
                    grupoSesion: s.orden,
                    idMatriculaCabecera: 63526,
                    idPEspecifico: 20753,
                    idPEspecificoSesion: 39223,
                  });
                }
              });
            }
          }
        },
      });
  }

  ObtenerSesionesOnlineWebinarPorIdPespecifico() {
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarPorIdPespecifico(this.IdPEspecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.sesionesAll = x;
          this.ObtenerAsistencia();
        },
      });
  }
}
