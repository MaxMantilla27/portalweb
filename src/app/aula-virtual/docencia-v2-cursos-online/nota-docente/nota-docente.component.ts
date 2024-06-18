import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ExcelService } from 'src/app/Core/Shared/Services/Excel/excel.service';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';
import { DocenciaGestionNotasAntiguoComponent } from './docencia-gestion-notas-antiguo/docencia-gestion-notas-antiguo/docencia-gestion-notas-antiguo.component';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';
import { RemovePortalCriterioPipe } from 'src/app/Core/Shared/Pipes/remove-portal-criterio.pipe';

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
    alumno: 'Apellidos y Nombres'
  };
  TipoContenido: any = {
    //'Acciones': ['buttons'],
  };

  columnHeaderDetalle:any = {
    indice: 'N°',
    codigoMatricula: 'Código',
    alumno: 'Nombres Y Apellidos'
  };
  public sticky:any={
    indice: true,
    codigoMatricula: true,
    alumno: true};
  @Input() IdPespecifico = 0;
  constructor(
    private _NotaService:NotaService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private _ProveedorService:ProveedorService,
    public _removerPortalCriterioPipe:RemovePortalCriterioPipe
  ) { }
  public TerminaCarga=false;
  public DataProveedor:any
  ngOnInit(): void {
    this.ObtenerInformacionProveedor();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPespecifico != 0) {
      this.ListadoNotaProcesarOnline();
      this.ObtenerInformacionProveedor();
    }
  }
  public detalle=false
  public verDetalle=false
  public infoNotas:Array<any>=[];
  public infoNotasDetalle:Array<any>=[];
  public listadoNotas:any
  public Colspam:Array<any>=[]
  ListadoNotaProcesarOnline(){
    this.listadoNotas=undefined;
    this.infoNotas=[]
    this.infoNotasDetalle=[]
    this._NotaService.ListadoNotaProcesarOnline(this.IdPespecifico,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=false
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
        this.listadoNotas.listadoMatriculas.forEach((mat:any) => {
          mat.notaActual=[];
          this.listadoNotas.listadoEvaluaciones.forEach((evl:any) => {
            evl.nombre=this._removerPortalCriterioPipe.transform(evl.nombre)
            if(evl.nombre.toUpperCase().includes('ASISTENCIA')){
              var totalasistencia=
                  this.listadoNotas.listadoAsistencias.filter((f:any)=> f.asistio == true && f.idMatriculaCabecera == mat.idMatriculaCabecera).length;
              var nota=0;
              if(this.listadoNotas.listadoSesiones!=null && this.listadoNotas.listadoSesiones.length>0){
                nota =  parseFloat(((totalasistencia / this.listadoNotas.listadoSesiones.length)*100).toFixed(2));
                // nota=Math.round(((((totalasistencia*1)/(this.listadoNotas.listadoSesiones.length)) * (this.listadoNotas.escalaCalificacion))* 10/10));
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
                var NotaPromediada=0
                var notasCountDestalle=1
                if(notas.detalle!=null){
                  var notasDetalleCriterio = []
                  notasDetalleCriterio=notas.detalle.filter((w:any) => w.idCriterioEvaluacion == evl.id)
                  if(notasDetalleCriterio.length>0){
                    notasCountDestalle=notasDetalleCriterio.length
                    notasDetalleCriterio.forEach((z:any)=>{
                      NotaPromediada=NotaPromediada+z.nota
                    })
                    NotaPromediada=parseFloat((NotaPromediada/notasCountDestalle).toFixed(2));
                  }
                  else{
                    NotaPromediada=parseFloat((notas.nota/notasCountDestalle).toFixed(2))
                  }
                }
                else{
                  NotaPromediada=parseFloat((notas.nota/notasCountDestalle).toFixed(2))
                }
                if(this.listadoNotas.escalaCalificacion!=100){
                  NotaPromediada=parseFloat(((NotaPromediada*100)/this.listadoNotas.escalaCalificacion).toFixed(2))
                }
                else{
                  NotaPromediada=parseFloat(NotaPromediada.toFixed(2))
                }
                mat.notaActual.push({
                  nota:NotaPromediada,
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
      },
      complete:()=>{
        this.TerminaCarga=true;
        this.OrdenarNotas();

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
        data.detalle=m.detalles;
        if(m.notaActual!=null && m.notaActual!=undefined){
          var notaFinal=0
          m.notaActual.forEach((na:any) => {
            var nota=na.nota
            var escala=this.listadoNotas.listadoEvaluaciones.filter((w:any) => w.id == na.IdEvaluacion)[0]
            notaFinal+=nota*(escala.porcentaje/100)
            data['z'+na.IdEvaluacion]= nota;
            data.Ponderaciones.push({
              nombre:escala.nombre+' \n ('+escala.porcentaje+'%)',
              value:nota
            })
          });
          var notaRedondeada = Math.round(notaFinal);
          data['zzFinal']='<strong>'+notaRedondeada+'</strong>' ;

        }
        this.infoNotas.push(data);

        i++
      });
    }
    if(this.detalle==true){
      this.OrdenarDetalle()
    }
  }
  OrdenarDetalle(){
    this.InicializarColumnasDetalle();
    this.Colspam=[];
    this.listadoNotas.listadoEvaluaciones.forEach((e:any) => {
      if(e.nombre.toUpperCase().includes('ASISTENCIA')){
        this.columnHeaderDetalle['z'+e.id]='Asistencia <br> '+e.porcentaje+'%'
      }else{
        if(e.evaluaciones>0){
          this.Colspam.push({
            id:e.id,
            nombre:e.nombre + '<br> '+e.porcentaje+'%',
            colspam:0,
            inicio:0
          })
        }
      }
    })
    if(this.listadoNotas.listadoNotas!=null){

      var detalles=this.listadoNotas.listadoNotas[0].detalle

      let claves=undefined;
      claves = Object.keys(this.columnHeaderDetalle);
      var inicio=0;
      inicio=claves.length
      this.Colspam.forEach((c:any) => {
        c.inicio=inicio+1;

        detalles.forEach((d:any) => {
          if(d.idCriterioEvaluacion==c.id){
            this.columnHeaderDetalle['z'+c.id+'-'+d.id]=d.nombre
            inicio++
            c.colspam++
          }
        });
        this.columnHeaderDetalle['z'+c.id]='Promedio'
        c.colspam++
      });
    }
    this.columnHeaderDetalle['zzFinal']='Promedio <br> Final';
    if(this.infoNotas!=null){
      let i=1
      this.infoNotas.forEach((m:any) => {
        var data:any={}
        data.indice= m.indice,
        data.codigoMatricula=m.codigoMatricula,
        data.alumno=m.alumno
        data.zzFinal=m.zzFinal
        data.Ponderaciones=[]
        this.listadoNotas.listadoEvaluaciones.forEach((e:any) => {
          if(e.nombre.toUpperCase().includes('ASISTENCIA')){

            data.Ponderaciones.push({
              nombre:e.nombre+' \n ('+e.porcentaje+'%)',
              value:m['z'+e.id],
              inx:'z'+e.id
            })
          }else{
            data.Ponderaciones.push({
              nombre:e.nombre+' \n Promedio',
              value:m['z'+e.id],
              inx:'z'+e.id
            })
          }
          data['z'+e.id]=m['z'+e.id];
        })
        m.detalle.forEach((det:any) => {
          data.Ponderaciones.push({
            nombre:det.criterio+' \n '+det.nombre,
            value:det.nota==null?0:det.nota,
            inx:'z'+det.idCriterioEvaluacion+'-'+det.id
          })
          data['z'+det.idCriterioEvaluacion+'-'+det.id]=det.nota==null?0:det.nota
        });

        data.Ponderaciones.sort(function (a:any, b:any) {
          return a.inx - b.inx;
        });
        this.infoNotasDetalle.push(data);
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
      data["Promedio Final"]= items?.zzFinal.split('<strong>').join('').split('</strong>').join('')
      return data
    });

    this.excelService.exportToExcel(
     fileToExport,
     'Notas-' + new Date().getTime()
   );
  }
  DownloadExcelDetalle(): void {
    const fileToExport = this.infoNotasDetalle.map((items:any) => {
      var data:any={}
      data["N°"]= items?.indice
      data["Código"]= items?.codigoMatricula
      data["Nombre y Apellidos"]= items?.alumno
      items.Ponderaciones.forEach((p:any) => {
        data[p.nombre]=p.value
      });
      data["Promedio Final"]= items?.zzFinal.split('<strong>').join('').split('</strong>').join('')
      return data
    });

    this.excelService.exportToExcel(
     fileToExport,
     'Notas-' + new Date().getTime()
   );
  }
  EditarNota(){
    const dialogRef = this.dialog.open(DocenciaGestionNotasAntiguoComponent, {
      width: '1000px',
      data: {
        grupo:1,
        IdPEspecifico:this.IdPespecifico,
        correo:this.DataProveedor.email},
      panelClass: 'custom-dialog-docencia-gestion-notas-antiguo-container',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      if(result){
        this.TerminaCarga=false;
        this.ListadoNotaProcesarOnline();
      }
    });
  }
  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.DataProveedor=x
      }
    })
  }
  InicializarColumnasDetalle(){
    this.columnHeaderDetalle=undefined;
    this.columnHeaderDetalle = {
      indice: 'N°',
      codigoMatricula: 'Código',
      alumno: 'Apellidos y Nombres'
    };
  }
}
