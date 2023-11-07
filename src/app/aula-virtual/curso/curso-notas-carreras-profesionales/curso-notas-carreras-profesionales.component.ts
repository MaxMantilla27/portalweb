import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso-notas-carreras-profesionales',
  templateUrl: './curso-notas-carreras-profesionales.component.html',
  styleUrls: ['./curso-notas-carreras-profesionales.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoNotasCarrerasProfesionalesComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _NotaService:NotaService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,


  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() IdMatricula=0;
  @Input() IdTipoProgramaCarrera=0;
  public charge=false;
  public CursosCriterios:any;
  public CursosCriteriosPrevio:any;
  public CursoAbierto=-1;
  public PromedioFinal=0;
  public PromedioFinalOnlineCurso=0;
  public infoNotas:Array<any>=[];
  public listadoNotas:any
  columnHeader:any = {
    indice: 'N°',
    codigoMatricula: 'Código',
    alumno: 'Apellidos y Nombres'
  };
  public CursosCriteriosOnline:any;
  public CursosCriteriosOnlineNotas:any;
  public NombreCursoOnline='';
  public Semestres:any;
  public OpenProx=false;
  public SemestreSelect=0;
  public NotaExamenSuficienciaProfesionalActivo=false
  public NotaTrabajoProfesionalActivo=false
  public NotaExamenSuficienciaProfesional=16
  public NotaTrabajoProfesional=17.5
  ngOnInit(): void {
    this.CursosCriteriosOnlineNotas=[];
    this.PromedioFinal=0;
    this._HelperService.recibirActivarTrabajoTipoExamenCarrera().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.NotaExamenSuficienciaProfesionalActivo=false
        this.NotaTrabajoProfesionalActivo=false
        if(x==1){
          this.NotaExamenSuficienciaProfesionalActivo=true
        }
        if(x==2){
          this.NotaTrabajoProfesionalActivo=true
        }
        console.log(x)
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.PromedioFinal=0;
    if(this.IdMatricula!=0){
      this.CursosCriterios=[]
      this.CursosCriteriosPrevio=[]
      if(this.IdTipoProgramaCarrera==2){
        this.ObtenerCursosProgramaPorIdMatriculaOnlineCarrerasProfesionales(this.IdMatricula);
      }
      else{
        this.ObtenerCursosProgramaPorIdMatriculaOnline(this.IdMatricula);
        this.ObtenerCursosProgramaPorIdMatricula(this.IdMatricula);
      }
    }
  }

  ObtenerCursosProgramaPorIdMatricula(idMatricula:number){
    this.PromedioFinal=0;
    this._NotaService.ObtenerCursosProgramaPorIdMatricula(idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosCriteriosPrevio=x;
        let cont=0;
        if(this.CursosCriteriosPrevio!=undefined){
          this.CursosCriteriosPrevio.forEach((x:any) => {
            x.nombreModalidad='Online Asincrónico';
            x.idPEspecifico=x.idPEspecificoHijo
            x.notaCurso=Math.round(x.notaCurso)
            this.CursosCriterios.push(x)
            this.PromedioFinal=this.PromedioFinal+x.notaCurso;
            cont++
          });
        }
        if(cont!=0){
          this.PromedioFinal=Math.round(this.PromedioFinal/cont)
        }
      },
      complete:()=> {
        console.log(this.CursosCriterios)
      },
    })
  }
  ObtenerCursosProgramaPorIdMatriculaOnline(idMatricula:number){
    this._NotaService.ObtenerCursosProgramaPorIdMatriculaOnline(idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosCriteriosOnline=x;
        console.log(this.CursosCriteriosOnline)
        this.CursosCriteriosOnline.forEach((y:any) => {
          this._NotaService.ListadoNotaProcesarV2(y.idPEspecifico,1,this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
              this.PromedioFinalOnlineCurso=0;
              this.NombreCursoOnline=y.nombrePEspecifico;
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
                    this.PromedioFinalOnlineCurso=notaFinal;
                  }
                  this.infoNotas.push(data);
                  i++
                });
                x=this.infoNotas[0];
                x.notaCurso=Math.round(this.PromedioFinalOnlineCurso);
                x.idPEspecifico=y.idPEspecifico
                x.nombrePEspecifico=this.NombreCursoOnline
                x.nombreModalidad='Online Sincrónico';
                this.CursosCriterios.push(x)
                let cont=0;
                this.PromedioFinal=0
                if(this.CursosCriterios!=undefined){
                  this.CursosCriterios.forEach((x:any) => {
                    this.PromedioFinal=this.PromedioFinal+x.notaCurso;
                    cont++
                  });
                }
                if(cont!=0){
                  this.PromedioFinal=Math.round(this.PromedioFinal/cont)
                }
                this.CursosCriterios.sort(function (a:any, b:any) {
                  return a.idPEspecifico - b.idPEspecifico;
                })
              }
            }
          })
        })
      },
      complete:()=> {
      },
    })
  }

  ObtenerCursosProgramaPorIdMatriculaOnlineCarrerasProfesionales(idMatricula:number){
    this._NotaService.ObtenerCursosProgramaPorIdMatriculaOnlineCarrerasProfesionales(idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosCriteriosOnline=x;
        console.log(this.CursosCriteriosOnline)
        this.Semestres=[];
        let count=0;
        this.CursosCriteriosOnline.forEach((y:any) => {
          if( this.Semestres.filter((w:any) => w.idCiclo == y.idCiclo).length>0==false){
            this.Semestres.push({
              valor:count,
              idCiclo:y.idCiclo,
              open:false
            })
            count++
          }
          this._NotaService.ListadoNotaProcesarCarreras(y.idPEspecifico,1,this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
            next:x=>{
              this.PromedioFinalOnlineCurso=0;
              this.NombreCursoOnline=y.nombrePEspecifico;
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
                    this.PromedioFinalOnlineCurso=notaFinal;
                  }
                  this.infoNotas.push(data);
                  i++
                });
                x=this.infoNotas[0];
                x.notaCurso=Math.round(this.PromedioFinalOnlineCurso);
                x.idPEspecifico=y.idPEspecifico
                x.nombrePEspecifico=this.NombreCursoOnline
                x.nombreModalidad='Online Sincrónico';
                x.idCiclo=y.idCiclo;
                this.CursosCriterios.push(x)
                let cont=0;
                this.PromedioFinal=0
                if(this.CursosCriterios!=undefined){
                  this.CursosCriterios.forEach((x:any) => {
                    this.PromedioFinal=this.PromedioFinal+x.notaCurso;
                    cont++
                  });
                }
                if(cont!=0){
                  this.PromedioFinal=Math.round(this.PromedioFinal/cont)
                }
                this.CursosCriterios.sort(function (a:any, b:any) {
                  return a.idPEspecifico - b.idPEspecifico;
                })
              }
            }
          })
        })
      },
      complete:()=> {
      },
    })
  }
  OpenSemestre(SemestreSeleccionado:number){
    this.Semestres.forEach((e:any) => {
      if(e.valor==SemestreSeleccionado)
      e.open=!e.open
    })
  }
}
