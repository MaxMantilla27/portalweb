import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { EnvioEncuestaDocenteOnlineComponent } from './envio-encuesta-docente-online/envio-encuesta-docente-online.component';
import { EnvioEncuestaDocenteOnlineService } from 'src/app/Core/Shared/Services/EnvioEncuestaDocenteOnline/envio-encuesta-docente-online.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { ActivatedRoute } from '@angular/router';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-pespecifico-sesion-encuesta',
  templateUrl: './pespecifico-sesion-encuesta.component.html',
  styleUrls: ['./pespecifico-sesion-encuesta.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PespecificoSesionEncuestaComponent implements OnInit, OnChanges, OnDestroy {
  private signal$ = new Subject();

  constructor(

    //public dialogRef: MatDialogRef<EnvioEncuestaDocenteOnlineComponent>,
    //@Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,
    private _EnvioEncuestaDocenteOnlineService: EnvioEncuestaDocenteOnlineService,
  ) { }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() IdSesion = 0;
  @Input() IdProveedor = 0;
  @Input() Sesion=0;
  @Input() IdPEspecifico=0;

  public encuesta: any;
  public charge = false;
  public EncuestaEnviada = false;


  ngOnInit(): void {
    console.log(this.Sesion)
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdSesion != 0) {
      console.log('carga temas....', this.IdSesion);
      this.charge = true;
      this.ObtenerPreguntasRespuestasEncuestaDocente(this.IdSesion,this.IdProveedor);
    }
  }

  ObtenerPreguntasRespuestasEncuestaDocente(idPEspecificoSesion: number,idProveedor:number){
    this.encuesta = undefined;
    this._EnvioEncuestaDocenteOnlineService
      .ObtenerPreguntasRespuestasEncuestaDocente(idPEspecificoSesion,idProveedor)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) =>{
          
          console.log(x)

          if (x!=null && x != 'null') {

          this.encuesta = x[0];

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

  openEncuestaDialogDocente() {

    
    console.log(this.IdSesion)

    const dialogRef = this.dialog.open(EnvioEncuestaDocenteOnlineComponent, {
      width: '800px',
      data:{
          encuesta: this.encuesta,
          index:'index',
          IdProveedor:this.IdProveedor,
          IdPEspecificoSesion:this.IdSesion,
          Sesion: this.Sesion,
          IdPEspecifico:this.IdPEspecifico,
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
      
          this.ObtenerPreguntasRespuestasEncuestaDocente(
            this.IdSesion,
            this.IdProveedor
          )

        }
      });
  }

}
