import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ExcelService } from 'src/app/Core/Shared/Services/Excel/excel.service';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';

@Component({
  selector: 'app-nota-docente',
  templateUrl: './nota-docente.component.html',
  styleUrls: ['./nota-docente.component.scss']
})
export class NotaDocenteComponent implements OnInit ,OnChanges, OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  columnHeader:any = {
    indice: 'N°',
    codigoMatricula: 'Código',
    alumno: 'Nombres Y Apellidos'
  };
  TipoContenido: any = {
    //'Acciones': ['buttons'],
  };
  public sticky:any={
    indice: true,
    codigoMatricula: true,
    alumno: true};
  @Input() IdPespecifico = 0;
  constructor(
    private _NotaService:NotaService,
    private excelService: ExcelService,
  ) { }
  public TerminaCarga=false;

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPespecifico != 0) {
      this.ListadoNotaProcesarOnline();
    }
  }

  public infoNotas:Array<any>=[];
  public listadoNotas:any
  ListadoNotaProcesarOnline(){
    this._NotaService.ListadoNotaProcesarOnline(this.IdPespecifico,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=false
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
        this.OrdenarNotas();
      },
      complete:()=>{
        this.TerminaCarga=true;
      }
    })
  }
  OrdenarNotas(){
    if(this.listadoNotas.listadoEvaluaciones!=null){
      this.listadoNotas.listadoEvaluaciones.forEach((e:any) => {
        this.columnHeader['z'+e.id]=e.nombre+' <br> '+e.porcentaje+'%'
      });
      if(this.listadoNotas.listadoEvaluaciones.length>0){
        this.columnHeader['zzFinal']='Promedio <br> Final';
      }

    }
    if(this.listadoNotas.listadoMatriculas!=null){
      let i=1
      this.listadoNotas.listadoMatriculas.forEach((m:any) => {
        var data:any={}
        m.indice=i
        data.indice= i,
        data.codigoMatricula=m.codigoMatricula,
        data.alumno=m.alumno
        data.Ponderaciones=[]
        if(m.notaActual!=null && m.notaActual!=undefined){
          var notaFinal=0
          m.notaActual.forEach((na:any) => {
            var nota=na.nota
            if(this.listadoNotas.escalaCalificacion!=null && this.listadoNotas.escalaCalificacion>0){
              nota=na.nota*(100/this.listadoNotas.escalaCalificacion)
            }
            var escala=this.listadoNotas.listadoEvaluaciones.filter((w:any) => w.id == na.IdEvaluacion)[0]
            notaFinal+=nota*(escala.porcentaje/100)
            data['z'+na.IdEvaluacion]= nota;
            data.Ponderaciones.push({
              nombre:escala.nombre+' ('+escala.porcentaje+'%)',
              value:nota
            })
          });
          data['zzFinal']='<strong>'+notaFinal+'</strong>' ;

        }

        this.infoNotas.push(data);

        i++
      });
    }
  }

  DownloadExcel(): void {
    const fileToExport = this.infoNotas.map((items:any) => {
      var data:any={}
      data["N°"]= items?.indice
      data["Código"]= items?.codigoMatricula
      data["Nombre y Apellidos"]= items?.alumno
      items.Ponderaciones.forEach((p:any) => {
        data[p.nombre]=p.value
      });
      data["Promedio Final"]= items?.zzFinal
      return data
    });

    this.excelService.exportToExcel(
     fileToExport,
     'PerfilAlumnos-' + new Date().getTime()
   );
  }
}
