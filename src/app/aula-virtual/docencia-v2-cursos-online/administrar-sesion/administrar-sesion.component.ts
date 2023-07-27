import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { RegistrarAsistenciaOnlineComponent } from './registrar-asistencia-online/registrar-asistencia-online.component';

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

  ) {}
  public IdPespecifico = 0;
  public sesiones: any;
  public IdSesion = 0;
  @Input() DataProveedor:any
  public sesion:any
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.IdPespecifico = parseInt(x['IdPespecifico']);
        this.ObtenerSesionesOnlineWebinarDocentePorIdPespecifico();
      },
    });
  }
  ObtenerSesionesOnlineWebinarDocentePorIdPespecifico() {
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(this.IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.sesiones = x;
          console.log(this.sesiones);
          if (
            this.sesiones != undefined &&
            this.sesiones != null &&
            this.sesiones.length > 0
          ) {
            this.sesiones.forEach((s: any) => {
              if (this.IdSesion == 0) {
                if (s.esVisible == true) {
                  this.IdSesion = s.idSesion;
                  this.sesion=s
                }
              }
            });
            if (this.IdSesion == 0) {
              this.IdSesion = this.sesiones[this.sesiones.length - 1].idSesion;
              this.sesion=this.sesiones[this.sesiones.length - 1]
            }
          }
        },
      });
  }
  ObtnerDataSesion(){
    this.sesiones.forEach((s:any) => {
      if(s.idSesion==this.IdSesion){
        this.sesion=s
      }
    });
  }

  OpenAsistencias(){
    this.sesiones.forEach((s:any) => {
      if(s.idSesion==this.IdSesion){
        this.sesion=s
      }
    });
    const dialogRef = this.dialog.open(RegistrarAsistenciaOnlineComponent, {
      width: '1000px',
      data: { IdPespecifico: this.IdPespecifico,IdSesion:this.IdSesion,Sesion:this.sesion,correo:this.DataProveedor.email },
      panelClass: 'dialog-Tarjeta',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){

      }
    });
  }
}
