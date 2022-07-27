import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { NotaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { AprovacionComponent } from 'src/app/Core/Shared/Containers/Dialog/aprovacion/aprovacion.component';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-docencia-gestion-notas-registro',
  templateUrl: './docencia-gestion-notas-registro.component.html',
  styleUrls: ['./docencia-gestion-notas-registro.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaGestionNotasRegistroComponent implements OnInit,OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<DocenciaGestionNotasRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _OperacionesNotaService:OperacionesNotaService,
    private _SnackBarServiceService: SnackBarServiceService,
    public dialog: MatDialog
  ) { }
  private signal$ = new Subject();
  public listadoNotas:any
  public notas:Array<NotaRegistrarDTO>=[]
  public charge=false;
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    console.log(this.data)
    this.ListadoNotaProcesar(this.data.IdPEspecifico,this.data.grupo)
  }

  ListadoNotaProcesar(idPEspecifico:number,grupo:number){
    this._OperacionesNotaService.ListadoNotaProcesar(idPEspecifico,grupo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.listadoNotas=x;
        this.listadoNotas.ListadoMatriculas.forEach((mat:any) => {
          mat.notaActual=[];
          this.listadoNotas.ListadoEvaluaciones.forEach((evl:any) => {
            if(evl.Nombre.toUpperCase().includes('ASISTENCIA')){
              var totalasistencia=
                  this.listadoNotas.ListadoAsistencias.filter((f:any)=> f.Asistio == true && f.IdMatriculaCabecera == mat.IdMatriculaCabecera).length;
              var nota=0;
              if(this.listadoNotas.ListadoSesiones!=null && this.listadoNotas.ListadoSesiones.length>0){
                console.log(totalasistencia)
                nota=Math.round((((totalasistencia*1)/(this.listadoNotas.ListadoSesiones.length)) * (this.listadoNotas.EscalaCalificacion))* 10)/10;
                console.log(nota)
              }
              mat.notaActual.push({
                nota:nota,
                Id:0,
                IdEvaluacion:evl.Id,IdMatriculaCabecera:mat.IdMatriculaCabecera,
                edit:false});
            }else{
              if(this.listadoNotas.ListadoNotas.filter((w:any) => w.IdEvaluacion == evl.Id && w.IdMatriculaCabecera == mat.IdMatriculaCabecera).length>0){
                var notas=this.listadoNotas.ListadoNotas.filter((w:any) => w.IdEvaluacion == evl.Id && w.IdMatriculaCabecera == mat.IdMatriculaCabecera)[0]

                mat.notaActual.push({
                  nota:(notas.Nota!=null && notas.Nota>0)?notas.Nota:0,
                  Id:notas.Id,
                  IdEvaluacion:notas.IdEvaluacion,
                  IdMatriculaCabecera:mat.IdMatriculaCabecera,
                  edit:true});
              }else{
                mat.notaActual.push({
                  nota:0,
                  Id:0,
                  IdEvaluacion:evl.Id,
                  IdMatriculaCabecera:mat.IdMatriculaCabecera,
                  edit:true});
              }
            }
          });
        });
        console.log(this.listadoNotas)
      }
    })
  }
  RegistrarNotaDetalleDocente(){
    if(this.charge==false){
      this.charge=true;
      this.notas=[];
      this.listadoNotas.ListadoMatriculas.forEach((mat:any) => {
        mat.notaActual.forEach((nta:any) => {
          if(nta.edit==true){
            this.notas.push({
              Id:nta.Id,
              IdEvaluacion:nta.IdEvaluacion,
              IdMatriculaCabecera:nta.IdMatriculaCabecera,
              Nota:nta.nota
            })
          }
        });
      });
      this._OperacionesNotaService.Registrar(this.notas,this.data.IdPEspecifico,this.data.correo).pipe(takeUntil(this.signal$)).subscribe({
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
              text:'Confirmación de finalizaciónde registros'
            },
          contenido:'Si confirma la finalización de registros del curso ya no podrá editar ni visualizar la ventana actual.'},
        panelClass: 'custom-dialog-aprovacion',
      });

      dialogApr.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
        console.log(result);
        if(result==true){
          this.AprobarNotaDetalleDocente();
        }
      });
    }
  }
  AprobarNotaDetalleDocente(){
    this.charge=true;
    this.notas=[];
    this.listadoNotas.ListadoMatriculas.forEach((mat:any) => {
      mat.notaActual.forEach((nta:any) => {
        if(nta.edit==true){
          this.notas.push({
            Id:nta.Id,
            IdEvaluacion:nta.IdEvaluacion,
            IdMatriculaCabecera:nta.IdMatriculaCabecera,
            Nota:nta.nota
          })
        }
      });
    });
    this._OperacionesNotaService.Aprobar(this.notas,this.data.IdPEspecifico,this.data.correo,this.data.grupo).pipe(takeUntil(this.signal$)).subscribe({
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
