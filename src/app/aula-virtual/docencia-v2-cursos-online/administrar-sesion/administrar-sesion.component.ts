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
//import { EnvioEncuestaDocenteOnlineComponent } from './pespecifico-sesion-encuesta/envio-encuesta-docente-online/envio-encuesta-docente-online.component';
import { EnvioEncuestaDocenteOnlineService } from 'src/app/Core/Shared/Services/EnvioEncuestaDocenteOnline/envio-encuesta-docente-online.service';


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
    private _SessionStorageService: SessionStorageService,
    //private _EnvioEncuestaDocenteOnlineService: EnvioEncuestaDocenteOnlineService,
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
  public fechaFinSesion:any;
  public encuesta: any;
  public IdPGeneral = 0;
  public EncuestaEnviada = false;

  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        this.IdPespecifico = parseInt(x['IdPespecifico']);
        this.ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(
          this.IdPespecifico
        );
      },
    });

    
    /*
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.IdPespecifico = parseInt(x['IdPespecifico']);
        this.ObtenerPreguntasRespuestasEncuestaDocente(
          this.IdPespecifico);
      }
    })*/
    console.log(this.IdPGeneral);
    //this.ObtenerPreguntasRespuestasEncuestaDocente(42553,192);
    console.log(this.sesiones)
  }
  ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(IdPespecifico: number) {
    this.loadingSesiones = false;
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
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
                  console.log(this.sesion)
                  //this.IdPGeneral= this.sesion.IdPGeneral.idPGeneral;
                  
                }
                this.fechaFinSesion=new Date(s.fechaSesion)
                console.log(this.fechaFinSesion)

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
                this.fechaFinSesion=new Date(s.fechaSesion)
                console.log(new Date(this.fechaFinSesion))

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
    console.log(this.sesiones)
    this.sesiones.forEach((s: any) => {
      if (s.idSesion == this.IdSesion) {
        console.log(s);
        this.sesion = s;
      }
      this.fechaFinSesion=new Date(s.fechaSesion)
      console.log(this.fechaFinSesion)

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
/*
  ObtenerPreguntasRespuestasEncuestaDocente(idPEspecificoSesion: number,idProveedor:number){

    this._EnvioEncuestaDocenteOnlineService
      .ObtenerPreguntasRespuestasEncuestaDocente(idPEspecificoSesion,idProveedor)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) =>{
          console.log(x)
          this.encuesta = x[0];

        if (x!=null) {
          x.forEach((d: any) => {
            d.disabled = false;

            if (d.tipo.toLowerCase() == 'encuesta') {
              d.encuestaEnviada = true;

              if (d.respuestasEncuesta.length == 0) {
                d.encuestaEnviada = false;

              }
              //this.encuesta.push(d);
              console.log(this.encuesta)
            }

          })
        }

        }
      })
  }
  */

  //indexSesion: number, index: number
  /*
  openEncuestaDialogDocente() {

    console.log(this.DataProveedor.id)
    console.log(this.IdSesion)

    const dialogRef = this.dialog.open(EnvioEncuestaDocenteOnlineComponent, {
      width: '800px',
      data:{
          encuesta: this.encuesta,
          index:'index',
          IdProveedor:this.DataProveedor.id,
          IdPEspecificoSesion:this.IdSesion,
          IdPGeneral:this.sesion.idPGeneral,
          IdPEspecifico:this.IdPespecifico,
      },
      panelClass: 'dialog-envio-encuesta-online',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.signal$))
      .subscribe((result) => {
        console.log(result)
        if (result != undefined && result.length > 0) {
          console.log('Holaaaaaaaaaaaaaaaaaaaaaaaaa');
          
          this.ObtenerPreguntasRespuestasEncuestaDocente(
            this.sesiones[indexSesion].idSesion,
            indexSesion
          );
        }
      });
  }*/

}
