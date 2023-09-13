import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-modulo-calificaciones-online',
  templateUrl: './modulo-calificaciones-online.component.html',
  styleUrls: ['./modulo-calificaciones-online.component.scss']
})
export class ModuloCalificacionesOnlineComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _NotaService:NotaService,
    private _ProgramaContenidoService:ProgramaContenidoService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdMatriculaCabecera=0
  @Input() IdPEspecifico=0
  @Input() Capitulo=''
  @Input() IdPGeneralHijo=0
  @Input() IdTipoProgramaCarrera=0
  public criterioPendiente=false;
  public calificacionesCurso:Array<any>=[];
  public calificacionesCursoDetalle:Array<any>=[];
  public error=false;
  public mensajeError='';
  public promedio=0;
  public idMatricula=0;
  public CursosCriterios:any;
  public infoNotas:Array<any>=[];
  public listadoNotas:any
  public PromedioFinal=0;
  public CursosCriteriosOnline:any
  public DatosCargados=false
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.promedio=0;
    if(this.IdMatriculaCabecera!=0){
      this.DatosCargados=false
      this.CursosCriterios=[]
      this.ObtenerCursosProgramaPorIdMatriculaOnline(this.IdMatriculaCabecera);
      if(this.IdTipoProgramaCarrera==2){
        this.ObtenerCursosProgramaPorIdMatriculaOnlineCarrerasProfesionales(this.IdMatriculaCabecera);
      }
      else{
        this.ObtenerCursosProgramaPorIdMatriculaOnline(this.IdMatriculaCabecera);
      }
      this.DatosCargados=true;

    }

  }
  ObtenerCursosProgramaPorIdMatriculaOnline(idMatricula:number){
    this._NotaService.ListadoNotaProcesarV2(this.IdPEspecifico,1,idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.listadoNotas=x;
        if(this.listadoNotas.listadoEvaluaciones==null)this.listadoNotas.listadoEvaluaciones=[];
        if(this.listadoNotas.listadoNotas==null)this.listadoNotas.listadoNotas=[];
        if(this.listadoNotas.listadoMatriculas==null)this.listadoNotas.listadoMatriculas=[];
        if(this.listadoNotas.listadoSesiones==null)this.listadoNotas.listadoSesiones=[];
        if(this.listadoNotas.listadoAsistencias==null)this.listadoNotas.listadoAsistencias=[];
        this.listadoNotas.listadoMatriculas.forEach((mat:any) => {
          mat.notaActual=[];
          this.listadoNotas.listadoEvaluaciones.forEach((evl:any) => {
            if(evl.nombre.toUpperCase().includes('ASISTENCIA')){
              var totalasistencia=
                  this.listadoNotas.listadoAsistencias.filter((f:any)=> f.asistio == true && f.idMatriculaCabecera == mat.idMatriculaCabecera).length;
              var nota=0;
              if(this.listadoNotas.listadoSesiones!=null && this.listadoNotas.listadoSesiones.length>0){
                nota=Math.round((((totalasistencia*1)/(this.listadoNotas.listadoSesiones.length)) * (this.listadoNotas.escalaCalificacion))* 10)/10;
              }
              mat.notaActual.push({
                nota:nota,
                Id:0,
                IdEvaluacion:evl.id,
                IdMatriculaCabecera:mat.idMatriculaCabecera,
                edit:false});
            }else{
              if(this.listadoNotas.listadoNotas.filter((w:any) => w.idEvaluacion == evl.id && w.idMatriculaCabecera == mat.idMatriculaCabecera).length>0){
                var notas=this.listadoNotas.listadoNotas.filter((w:any) => w.idEvaluacion == evl.id && w.idMatriculaCabecera == mat.idMatriculaCabecera)[0]

                mat.notaActual.push({
                  nota:(notas.nota!=null && notas.nota>0)?notas.nota:0,
                  Id:notas.id,
                  IdEvaluacion:notas.idEvaluacion,
                  IdMatriculaCabecera:mat.idMatriculaCabecera,
                  edit:true});
              }else{
                mat.notaActual.push({
                  nota:0,
                  Id:0,
                  IdEvaluacion:evl.id,
                  IdMatriculaCabecera:mat.idMatriculaCabecera,
                  edit:true});
              }
            }
          });
        });
        console.log(this.listadoNotas)
        if(this.listadoNotas.listadoMatriculas!=null){
          let i=1
          this.listadoNotas.listadoMatriculas.forEach((m:any) => {
            this.infoNotas=[]
            var data:any={}
            m.indice=i
            data.detalleCalificacion=[]
            if(m.notaActual!=null && m.notaActual!=undefined){
              var notaFinal=0
              m.notaActual.forEach((na:any) => {
                var nota=na.nota
                if(this.listadoNotas.escalaCalificacion!=null && this.listadoNotas.escalaCalificacion>0){
                  nota=na.nota*(100/this.listadoNotas.escalaCalificacion)
                }
                var escala=this.listadoNotas.listadoEvaluaciones.filter((w:any) => w.id == na.IdEvaluacion)[0]
                notaFinal+=nota*(escala.porcentaje/100)
                data.detalleCalificacion.push({
                  criterioEvaluacion:escala.nombre,
                  ponderacion:escala.porcentaje,
                  valor:Math.round(nota)
                })
              });
              data.detalleCalificacion.push({
                criterioEvaluacion:'Promedio',
                ponderacion:100,
                valor:Math.round(notaFinal)
              })
            }
            this.infoNotas.push(data);
            i++
          });
          console.log(x)
          console.log(this.infoNotas)
          x=this.infoNotas[0];
          this.CursosCriterios=x
          console.log(this.CursosCriterios)
        }
      }
    })


  }
  ObtenerCursosProgramaPorIdMatriculaOnlineCarrerasProfesionales(idMatricula:number){
    this._NotaService.ListadoNotaProcesarCarreras(this.IdPEspecifico,1,idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.listadoNotas=x;
        if(this.listadoNotas.listadoEvaluaciones==null)this.listadoNotas.listadoEvaluaciones=[];
        if(this.listadoNotas.listadoNotas==null)this.listadoNotas.listadoNotas=[];
        if(this.listadoNotas.listadoMatriculas==null)this.listadoNotas.listadoMatriculas=[];
        if(this.listadoNotas.listadoSesiones==null)this.listadoNotas.listadoSesiones=[];
        if(this.listadoNotas.listadoAsistencias==null)this.listadoNotas.listadoAsistencias=[];
        this.listadoNotas.listadoMatriculas.forEach((mat:any) => {
          mat.notaActual=[];
          this.listadoNotas.listadoEvaluaciones.forEach((evl:any) => {
            if(evl.nombre.toUpperCase().includes('ASISTENCIA')){
              var totalasistencia=
                  this.listadoNotas.listadoAsistencias.filter((f:any)=> f.asistio == true && f.idMatriculaCabecera == mat.idMatriculaCabecera).length;
              var nota=0;
              if(this.listadoNotas.listadoSesiones!=null && this.listadoNotas.listadoSesiones.length>0){
                nota=Math.round((((totalasistencia*1)/(this.listadoNotas.listadoSesiones.length)) * (this.listadoNotas.escalaCalificacion))* 10)/10;
              }
              mat.notaActual.push({
                nota:nota,
                Id:0,
                IdEvaluacion:evl.id,
                IdMatriculaCabecera:mat.idMatriculaCabecera,
                edit:false});
            }else{
              if(this.listadoNotas.listadoNotas.filter((w:any) => w.idEvaluacion == evl.id && w.idMatriculaCabecera == mat.idMatriculaCabecera).length>0){
                var notas=this.listadoNotas.listadoNotas.filter((w:any) => w.idEvaluacion == evl.id && w.idMatriculaCabecera == mat.idMatriculaCabecera)[0]

                mat.notaActual.push({
                  nota:(notas.nota!=null && notas.nota>0)?notas.nota:0,
                  Id:notas.id,
                  IdEvaluacion:notas.idEvaluacion,
                  IdMatriculaCabecera:mat.idMatriculaCabecera,
                  edit:true});
              }else{
                mat.notaActual.push({
                  nota:0,
                  Id:0,
                  IdEvaluacion:evl.id,
                  IdMatriculaCabecera:mat.idMatriculaCabecera,
                  edit:true});
              }
            }
          });
        });
        console.log(this.listadoNotas)
        if(this.listadoNotas.listadoMatriculas!=null){
          let i=1
          this.listadoNotas.listadoMatriculas.forEach((m:any) => {
            this.infoNotas=[]
            var data:any={}
            m.indice=i
            data.detalleCalificacion=[]
            if(m.notaActual!=null && m.notaActual!=undefined){
              var notaFinal=0
              m.notaActual.forEach((na:any) => {
                var nota=na.nota
                if(this.listadoNotas.escalaCalificacion!=null && this.listadoNotas.escalaCalificacion>0){
                  nota=na.nota*(100/this.listadoNotas.escalaCalificacion)
                }
                var escala=this.listadoNotas.listadoEvaluaciones.filter((w:any) => w.id == na.IdEvaluacion)[0]
                notaFinal+=nota*(escala.porcentaje/100)
                data.detalleCalificacion.push({
                  criterioEvaluacion:escala.nombre,
                  ponderacion:escala.porcentaje,
                  valor:Math.round(nota)
                })
              });
              data.detalleCalificacion.push({
                criterioEvaluacion:'Promedio',
                ponderacion:100,
                valor:Math.round(notaFinal)
              })
            }
            this.infoNotas.push(data);
            i++
          });
          console.log(x)
          console.log(this.infoNotas)
          x=this.infoNotas[0];
          this.CursosCriterios=x
          console.log(this.CursosCriterios)
        }
      }
    })


  }

}
