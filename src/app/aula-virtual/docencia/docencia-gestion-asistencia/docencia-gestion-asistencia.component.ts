import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { AsistenciaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { AprovacionComponent } from 'src/app/Core/Shared/Containers/Dialog/aprovacion/aprovacion.component';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';
import { OperacionesAsistenciaService } from 'src/app/Core/Shared/Services/OperacionesAsistencia/operaciones-asistencia.service';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-docencia-gestion-asistencia',
  templateUrl: './docencia-gestion-asistencia.component.html',
  styleUrls: ['./docencia-gestion-asistencia.component.scss']
})
export class DocenciaGestionAsistenciaComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor(
    public _OperacionesNotaService:OperacionesNotaService,
    public _OperacionesAsistenciaService:OperacionesAsistenciaService,
    private _SnackBarServiceService: SnackBarServiceService,
    private _NotaService:NotaService ,
    public dialog: MatDialog,
    public _asistencia: AsistenciaService
    ) { }

  public asistencias:Array<AsistenciaRegistrarDTO>=[]
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public listadoAsistencias:any
  public charge=false;
  public data = {grupo: 1,IdPEspecifico:15647,correo:'viranamorales@yahoo.es'};
  public opciones:string[]=["Asistio", "Falta"];

  columnHeader:any = {
    indice: 'N°',
    codigoMatricula: 'Código',
    alumno: 'Apellidos y Nombres'
  };
  DisableSort:any={}
  DisableCell:any={}
  TipoContenido: any = {
    //'Acciones': ['buttons'],
  };
  TipoContenidoHeader: any = {
    //'Acciones': ['buttons'],
  };
  public dataSeldt:Array<Basic>=[
    {Nombre:'Faltó',value:false},
    {Nombre:'Asistió',value:true}
  ]
  public sticky:any={
    alumno: true};
  public buttonheader:any={};
  public infoAsistencias:Array<any>=[];
  public fechaUltimaSesion:any
  public fechaActual:any
  public today:any;
  public DisabledFinalizarRegistro=true;
  @Input() idPEspecifico=0
  @Input() IdEstadoPEspecifico=0
  @Input() DataProveedor: any;
  public OpcionGuardar=true;
  public Registrando=false;
  ngOnInit(): void {
    console.log(this.data)
    this.today= new Date();
    this.fechaActual= new DatePipe('es-Pe').transform(this.today, 'yyyy-MM-ddTHH:mm:ss.SSS');

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.DataProveedor)
    console.log(this.idPEspecifico)
    if(this.idPEspecifico>0){
      this.ListadoAsistenciaProcesar();
    }

  }
  ListadoAsistenciaProcesar(){
    this._NotaService.ListadoAsistenciaProcesar(this.idPEspecifico,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.listadoAsistencias=x;
        this.listadoAsistencias.listadoMatriculas.forEach((mat:any) => {
          mat.asistenciaAlumno=[];
          this.listadoAsistencias.listadoSesiones.forEach((ses:any) => {
            if(this.listadoAsistencias.listadoAsistencias!=null){
              var asistencia=this.listadoAsistencias.listadoAsistencias.
                filter((w:any) => w.idPespecificoSesion == ses.id && w.idMatriculaCabecera == mat.idMatriculaCabecera)[0];
              if(asistencia!=undefined){
                mat.asistenciaAlumno.push({
                  Id:asistencia.id,
                  IdPEspecificoSesion:asistencia.idPespecificoSesion,
                  IdMatriculaCabecera:asistencia.idMatriculaCabecera,
                  Justifico:false,
                  Asistio:asistencia.asistio
                })
              }else{
                mat.asistenciaAlumno.push({
                  Id:0,
                  IdPEspecificoSesion:ses.id,
                  IdMatriculaCabecera:mat.idMatriculaCabecera,
                  Justifico:false,
                  Asistio:null
                })
              }
            }
            else{
              mat.asistenciaAlumno.push({
                Id:0,
                IdPEspecificoSesion:ses.id,
                IdMatriculaCabecera:mat.idMatriculaCabecera,
                Justifico:false,
                Asistio:null
              })
            }
          },);
        });
        this.ArmarTablaMaterial();
        // this.listadoAsistencias.listadoSesiones.sort((a:any, b:any) => a.fechaHoraInicio > b.fechaHoraInicio)
        if(this.listadoAsistencias.listadoSesiones>=2){
        this.listadoAsistencias.listadoSesiones.sort((a:any, b:any) => new Date(a.fechaHoraInicio).getTime() > new Date(b.fechaHoraInicio).getTime());
        }
        console.log(this.fechaActual)
        console.log(this.listadoAsistencias.listadoSesiones[0].fechaHoraInicio)
        console.log(Math.round(moment.duration(moment(this.fechaActual).diff(moment(this.listadoAsistencias.listadoSesiones[0].fechaHoraInicio))).as('day')))
        if(Math.round(moment.duration(moment(this.fechaActual).diff(moment(this.listadoAsistencias.listadoSesiones[0].fechaHoraInicio))).as('day'))<=7){
          this.DisabledFinalizarRegistro=true
          console.log('Finalizar Registro se habilitará 1 semana después de la última sesión')
        }
        else{
          this.DisabledFinalizarRegistro=false
          console.log('Finalizar Registro Habilitado')
        }
      }
    })
  }
  ArmarTablaMaterial(){
    let i=1

    var datePipe = new DatePipe('en-US');
    if(this.listadoAsistencias.listadoSesiones!=undefined && this.listadoAsistencias.listadoSesiones!=null){
      this.listadoAsistencias.listadoSesiones.forEach((s:any) => {
        this.columnHeader['z'+s.id]='Sesión '+i+' <br> '+datePipe.transform(s.fechaHoraInicio, 'dd/MM/yyyy')
        this.TipoContenidoHeader['z'+s.id]=['html']
        this.TipoContenido['z'+s.id]=['select']
        this.buttonheader['z'+s.id]=['edit']
        this.DisableSort['z'+s.id]=true
        this.DisableCell['z'+s.id]=[true]

        i++
      });
    }
    i=1
    if(this.listadoAsistencias.listadoMatriculas!=undefined && this.listadoAsistencias.listadoMatriculas!=null){
      this.listadoAsistencias.listadoMatriculas.forEach((m:any) => {
        var data:any={}
        data.indice= i,
        data.codigoMatricula=m.codigoMatricula,
        data.alumno=m.alumno
        m.asistenciaAlumno.forEach((ma:any) => {
          data['z'+ma.IdPEspecificoSesion]= ma.Asistio==undefined?false:ma.Asistio;
        });
        this.infoAsistencias.push(data);
        i++
      });
    }
    console.log(this.infoAsistencias)
    console.log(this.columnHeader)
  }
  SelectChange(values:any){
    var codigo=this.infoAsistencias[values.index].codigoMatricula
    var valor=values.value=='true'?true:false;
    var id=values.column.split('z')[values.column.split('z').length-1]*1;
    console.log(codigo,valor,id)
    this.listadoAsistencias.listadoMatriculas.forEach((l:any) => {
      if(l.codigoMatricula==codigo){
        console.log(l.asistenciaAlumno)
        l.asistenciaAlumno.forEach((la:any) => {
          console.log(la)
          if(la.IdPEspecificoSesion==id){
            la.Asistio=valor
          }
        });
      }
    });
    console.log(this.listadoAsistencias)
  }
  HeaderChange(values:any){
    console.log(values)
    this.charge=false
    if(this.buttonheader[values][0]=='edit'){
      this.charge=true
    }
    this.listadoAsistencias.listadoSesiones.forEach((s:any) => {
      this.buttonheader['z'+s.id]=['edit']
      this.DisableCell['z'+s.id]=[true]
    });
    if(this.charge==true){
      this.buttonheader[values]=['edit_off']
      this.DisableCell[values]=[false]
    }
    console.log(this.charge)
  }
  RegistrarAsistenciaDetalleDocente(){
    console.log(this.charge)
    if(this.charge==false){
      this.charge=true;
      this.asistencias=[];
      console.log(this.listadoAsistencias.listadoMatriculas)
      this.listadoAsistencias.listadoMatriculas.forEach((mat:any) => {
        mat.asistenciaAlumno.forEach((asis:any) => {
          this.asistencias.push({
            Id:asis.Id,
            IdPEspecificoSesion:asis.IdPEspecificoSesion,
            IdMatriculaCabecera:asis.IdMatriculaCabecera,
            Asistio:asis.Asistio==null?false:asis.Asistio,
            Justifico:asis.Justifico
          })
        });
      });
      this.OpcionGuardar=false;
      this.Registrando=true;
      console.log(this.asistencias)
      this._asistencia.RegistrarAsistenciaSesion(this.asistencias,this.idPEspecifico,this.DataProveedor.email).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          console.log(this.asistencias)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");

        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          this.Registrando=false;
        },
        complete:() => {
          this.OpcionGuardar=true;
          this.Registrando=false;

        },
      })
    }
    else{
      this._SnackBarServiceService.openSnackBar("Debe terminar de editar para guardar los registros",'x', 10,'snackbarCrucigramaerror' );
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
    this.listadoAsistencias.listadoMatriculas.forEach((mat:any) => {
      mat.asistenciaAlumno.forEach((asis:any) => {
        this.asistencias.push({
          Id:asis.Id,
          IdPEspecificoSesion:asis.IdPEspecificoSesion,
          IdMatriculaCabecera:asis.IdMatriculaCabecera,
          Asistio:asis.Asistio==null?false:true,
          Justifico:asis.Justifico
        })
      });
    });
    this.Registrando=true;
    this._OperacionesAsistenciaService.Aprobar(this.asistencias,this.idPEspecifico,this.DataProveedor.email,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.charge=false
        this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");

      },
      error:e=>{
        console.log(e)
        this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
        this.charge=false

      },
      complete:()=>{
        this.Registrando=false;
      }
    })
  }



}
