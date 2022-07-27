import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AsistenciaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { AprovacionComponent } from 'src/app/Core/Shared/Containers/Dialog/aprovacion/aprovacion.component';
import { OperacionesAsistenciaService } from 'src/app/Core/Shared/Services/OperacionesAsistencia/operaciones-asistencia.service';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-docencia-gestion-asistencias-registro',
  templateUrl: './docencia-gestion-asistencias-registro.component.html',
  styleUrls: ['./docencia-gestion-asistencias-registro.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaGestionAsistenciasRegistroComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DocenciaGestionAsistenciasRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _OperacionesNotaService:OperacionesNotaService,
    public _OperacionesAsistenciaService:OperacionesAsistenciaService,
    private _SnackBarServiceService: SnackBarServiceService,
    public dialog: MatDialog
  ) { }

  private signal$ = new Subject();
  public asistencias:Array<AsistenciaRegistrarDTO>=[]
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public listadoAsistencias:any
  public charge=false;
  ngOnInit(): void {
    console.log(this.data)
    this.ListadoAsistenciaProcesar(this.data.IdPEspecifico,this.data.grupo)
  }
  ListadoAsistenciaProcesar(idPEspecifico:number,grupo:number){
    this._OperacionesNotaService.ListadoAsistenciaProcesar(idPEspecifico,grupo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.listadoAsistencias=x;
        this.listadoAsistencias.ListadoMatriculas.forEach((mat:any) => {
          mat.asistenciaAlumno=[];
          this.listadoAsistencias.ListadoSesiones.forEach((ses:any) => {

            var asistencia=this.listadoAsistencias.ListadoAsistencias.
              filter((w:any) => w.IdPespecificoSesion == ses.Id && w.IdMatriculaCabecera == mat.IdMatriculaCabecera)[0];
              console.log(asistencia);
            if(asistencia!=undefined){
              mat.asistenciaAlumno.push({
                Id:asistencia.Id,
                IdPEspecificoSesion:asistencia.IdPespecificoSesion,
                IdMatriculaCabecera:asistencia.IdMatriculaCabecera,
                Justifico:false,
                Asistio:asistencia.Asistio
              })
            }else{
              mat.asistenciaAlumno.push({
                Id:0,
                IdPEspecificoSesion:ses.Id,
                IdMatriculaCabecera:mat.IdMatriculaCabecera,
                Justifico:false,
                Asistio:false
              })
            }
          });
        });
        console.log(this.listadoAsistencias)
      }
    })
  }
  RegistrarAsistenciaDetalleDocente(){
    if(this.charge==false){
      this.charge=true;
      this.asistencias=[];
      this.listadoAsistencias.ListadoMatriculas.forEach((mat:any) => {
        mat.asistenciaAlumno.forEach((asis:any) => {
          this.asistencias.push({
            Id:asis.Id,
            IdPEspecificoSesion:asis.IdPEspecificoSesion,
            IdMatriculaCabecera:asis.IdMatriculaCabecera,
            Asistio:asis.Asistio,
            Justifico:asis.Justifico
          })
        });
      });
      this._OperacionesAsistenciaService.Registrar(this.asistencias,this.data.IdPEspecifico,this.data.correo).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");
          this.dialogRef.close();
        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          this.dialogRef.close();
        }
      })
    }
  }

  ConfirmacionAprobarNotaDetalleDocente(){
    if(this.charge==false){
      const dialogApr = this.dialog.open(AprovacionComponent, {
        width: '400px',
        data: {
          titulo:
            {
              color:'#0059b3',
              sise:16,
              text:'Soporte Técnico'
            },
          contenido:'Si confirma la finalización de registros del curso ya no podrá editar ni visualizar la ventana actual.'},
        panelClass: 'custom-dialog-aprovacion',
      });

      dialogApr.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
        console.log(result);
        if(result==true){
          this.modalConfirmacionAprobacionAsistencia();
        }
      });
    }
  }
  modalConfirmacionAprobacionAsistencia(){
    this.charge=true;
    this.asistencias=[];
    this.listadoAsistencias.ListadoMatriculas.forEach((mat:any) => {
      mat.asistenciaAlumno.forEach((asis:any) => {
        this.asistencias.push({
          Id:asis.Id,
          IdPEspecificoSesion:asis.IdPEspecificoSesion,
          IdMatriculaCabecera:asis.IdMatriculaCabecera,
          Asistio:asis.Asistio,
          Justifico:asis.Justifico
        })
      });
    });
    this._OperacionesAsistenciaService.Aprobar(this.asistencias,this.data.IdPEspecifico,this.data.correo,this.data.grupo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.charge=false
        this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");
        this.dialogRef.close();
      },
      error:e=>{
        console.log(e)
        this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
        this.charge=false
        this.dialogRef.close();
      }
    })
  }
}
