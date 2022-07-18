import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { NotaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { DocenciaForosModalComponent } from '../../docencia-foros/docencia-foros-modal/docencia-foros-modal.component';

@Component({
  selector: 'app-docencia-gestion-notas-registro',
  templateUrl: './docencia-gestion-notas-registro.component.html',
  styleUrls: ['./docencia-gestion-notas-registro.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaGestionNotasRegistroComponent implements OnInit,OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<DocenciaForosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _OperacionesNotaService:OperacionesNotaService,
  ) { }
  private signal$ = new Subject();
  public listadoNotas:any
  public notas:Array<NotaRegistrarDTO>=[]
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
          mat.edit=false;
          mat.IdEvaluacion=0;
          mat.Id=0;
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
                IdEvaluacion:evl.Id,IdMatriculaCabecera:mat.IdMatriculaCabecera});
              mat.edit=false;
            }else{
              if(this.listadoNotas.ListadoNotas.filter((w:any) => w.IdEvaluacion == evl.Id && w.IdMatriculaCabecera == mat.IdMatriculaCabecera).length>0){
                var notas=this.listadoNotas.ListadoNotas.filter((w:any) => w.IdEvaluacion == evl.Id && w.IdMatriculaCabecera == mat.IdMatriculaCabecera)[0]

                mat.edit=true;
                mat.notaActual.push({
                  nota:(notas.Nota!=null && notas.Nota>0)?notas.Nota:0,
                  Id:notas.Id,
                  IdEvaluacion:notas.IdEvaluacion,
                  IdMatriculaCabecera:mat.IdMatriculaCabecera});
              }else{
                mat.notaActual.push({
                  nota:(notas.Nota!=null && notas.Nota>0)?notas.Nota:0,
                  Id:0,
                  IdEvaluacion:evl.Id,
                  IdMatriculaCabecera:mat.IdMatriculaCabecera});
                mat.edit=true;
              }
            }
          });
        });
        console.log(this.listadoNotas)
      }
    })
  }
  RegistrarNotaDetalleDocente(){
    this.listadoNotas.ListadoMatriculas.forEach((mat:any) => {
      this.notas.push({
        Id:mat.Id,
        IdEvaluacion:mat.IdEvaluacion,
        IdMatriculaCabecera:mat.IdMatriculaCabecera,
        Nota:mat.notaActual==undefined?0:mat.notaActual
      })
    });
    this._OperacionesNotaService.Registrar(this.notas).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
      }
    })
  }
}
