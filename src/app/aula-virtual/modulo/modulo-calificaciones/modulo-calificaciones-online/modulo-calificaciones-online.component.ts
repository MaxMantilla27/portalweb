import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-modulo-calificaciones-online',
  templateUrl: './modulo-calificaciones-online.component.html',
  styleUrls: ['./modulo-calificaciones-online.component.scss'],
  // encapsulation: ViewEncapsulation.None,

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
  public detalle=false
  public verDetalle=false
  public CursoAbierto=-1;
  public recargarDetalle=false;
  public TerminaCarga=false


  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.promedio=0;
    if(this.IdMatriculaCabecera!=0){
      this.CursosCriterios=[]
      this.ObtenerCursosProgramaPorIdMatriculaOnline(this.IdMatriculaCabecera);

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
        var detalles:Array<any>=[]
        if(this.listadoNotas.listadoNotas.length>0){
          var dte=this.listadoNotas.listadoNotas[0].detalle
          if(dte!=undefined && dte!=null && dte.length>0){
            this.detalle=true
            dte.forEach((y:any) => {
              detalles.push(y)
            });
          }
        }
        console.log(detalles)
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
          if(detalles.length>0){
            var d:Array<any>=[]
            this.listadoNotas.listadoNotas.forEach((n:any) => {
              if(mat.idMatriculaCabecera==n.idMatriculaCabecera){
                n.detalle.forEach((a:any )=> {
                  d.push(a)
                });
              }
            });
            if(d!=null && d.length==0){
              d=[]
              var dj=JSON.stringify(detalles);
              d=JSON.parse(dj)

              mat.detalles=[]
              d.forEach((a:any) => {
                a.nota=0
                a.idMatriculaCabecera=mat.idMatriculaCabecera
                mat.detalles.push(a)
              });
            }else{
              mat.detalles=[]
              d.forEach((a:any) => {
                mat.detalles.push(a)
              });
            }
          }
        });
        console.log(this.listadoNotas)
        if(this.listadoNotas.listadoMatriculas!=null){
          let i=1
          this.listadoNotas.listadoMatriculas.forEach((m:any) => {
            console.log(m)
            this.infoNotas=[]
            var data:any={}
            m.indice=i
            data.detalleCalificacion=[]
            if(m.notaActual!=null && m.notaActual!=undefined){
              var notaFinal=0
              m.notaActual.forEach((na:any) => {
                var nota=na.nota
                var calificacionDetallada:any=[]
                if(this.listadoNotas.escalaCalificacion!=null && this.listadoNotas.escalaCalificacion>0){
                  nota=na.nota*(100/this.listadoNotas.escalaCalificacion)
                }
                var escala=this.listadoNotas.listadoEvaluaciones.filter((w:any) => w.id == na.IdEvaluacion)[0]
                notaFinal+=nota*(escala.porcentaje/100)
                console.log(na)
                if(detalles.length>=1){
                  detalles.forEach((detcali:any) => {
                    console.log(detcali)
                    if(na.IdEvaluacion==detcali.idCriterioEvaluacion){
                      calificacionDetallada.push(detcali)
                    }
                  })
                }
                data.detalleCalificacion.push({
                  criterioEvaluacion:escala.nombre,
                  ponderacion:escala.porcentaje,
                  valor:Math.round(nota),
                  detalleCalificacion:calificacionDetallada,
                  cursoAbierto:false
                })
              });
              data.detalleCalificacion.push({
                criterioEvaluacion:'Promedio',
                ponderacion:100,
                valor:Math.round(notaFinal)
              })
              this.PromedioFinal=Math.round(notaFinal)
            }
            this.infoNotas.push(data);
            i++
          });
          console.log(x)
          console.log(this.infoNotas)
          x=this.infoNotas[0];
          this.CursosCriterios=x
          console.log(this.CursosCriterios)
          this.recargarDetalle=true
        }
      },
      complete:()=> {
        this.TerminaCarga=true
      },
    })
  }
  actualizarDesplegable(i:number,valor:boolean){
    console.log(i)
    console.log(valor)
    this.recargarDetalle=false
    let count=0
    this.CursosCriterios.detalleCalificacion.forEach((x:any) => {
      if(count==i){
        x.cursoAbierto=valor
      }
      count=count+1
    })
    console.log(this.CursosCriterios.detalleCalificacion)
    this.recargarDetalle=true
  }

}
