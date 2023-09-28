import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { PEspecificoSesionCuestionarioSaveDTO, PEspecificoSesionTareaSaveDTO, PEspecificoSesionMaterialAdicionalSaveDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AgregarTareaComponent } from './agregar-tarea/agregar-tarea.component';
import { AgregarCuestionarioComponent } from './agregar-cuestionario/agregar-cuestionario.component';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-pespecifico-sesion-esquema',
  templateUrl: './pespecifico-sesion-esquema.component.html',
  styleUrls: ['./pespecifico-sesion-esquema.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PespecificoSesionEsquemaComponent implements OnInit ,OnChanges, OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public dialog: MatDialog,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService,

  ) {}
  public ActividadSelect=-1
  public charge = false;
  public esquemas:Array<any>=[
    {
      id:1,
      nombre:'Tarea',
      visible:false,
      idCriterio:0
    },
    {
      id:2,
      nombre:'Cuestionario',
      visible:false,
      idCriterio:0
    }
  ]
  public criterios:Array<any>=[]
  public saveMaterial:PEspecificoSesionMaterialAdicionalSaveDTO={
    file:new File([],''),
    IdPEspecificoSesion:0,
    Usuario:'',
    Id:0
  }

  public progress=0
  public selectedFiles?: FileList;
  public filestatus=false
  public IdEditar:any=null
  public fileErrorMsg=''
  public materialAdicional=false
  public nombrefile = 'Seleccione Archivo';
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPespecifico != 0) {
      this.ObtenerCriteriosPorProgramaEspecifico();
    }
    if (this.IdSesion != 0) {
      console.log('carga criterios....', this.IdSesion);
      this.charge = true;
      this.ObtenerActividadesRecursoSesionDocente();
    }
  }
  @Input() IdSesion = 0;
  @Input() sesion : any;
  @Input() IdPespecifico = 0;
  ngOnInit(): void {
  }
  ObtenerActividadesRecursoSesionDocente(){
    this.criterios=[]
    this.ActividadSelect=-1
    this._PEspecificoEsquemaService.ObtenerActividadesRecursoSesionDocente(this.IdSesion).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x!=null){
          this.criterios=x
        }
        this.charge = false;
      },
    });
  }
  ObtenerCriteriosPorProgramaEspecifico(){
    this._PEspecificoEsquemaService.ObtenerCriteriosPorProgramaEspecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x!=null){
          this.esquemas.forEach((ea:any) => {
            x.forEach((e:any) => {
              if(e.nombre.toLowerCase().includes(ea.nombre.toLowerCase())){
                ea.visible=true
                ea.idCriterio=e.idCriterioEvaluacion
              }
            });
          });

        }
      },
    });
  }
  OpenEditar(i:number){
    var data=this.criterios[i]
    console.log(data)
    if(data.tipo=='Tarea'){
      this.materialAdicional=false
      const dialogRef = this.dialog.open(AgregarTareaComponent, {
        width: '1000px',
        data: {id:data.id ,idCriterio:data.idCriterio,sesion:this.sesion},
        panelClass: 'dialog-Agregar-Tarea',
       disableClose:true
      });

      dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
        console.log(result)
        if(result!=undefined && result.length>0){
          this.charge = true;
          this.ObtenerActividadesRecursoSesionDocente()
        }
      });
    }else{
      this.materialAdicional=false
      if(data.tipo=='Cuestionario'){
        const dialogRef = this.dialog.open(AgregarCuestionarioComponent, {
          width: '1000px',
          data: {id:data.id ,idCriterio:data.idCriterio,sesion:this.sesion},
          panelClass: 'dialog-Agregar-Tarea',
          disableClose:true
        });

        dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
          console.log(result)
          if(result!=undefined && result.length>0){
            this.charge = true;
            this.ObtenerActividadesRecursoSesionDocente()
          }
        });
      }else{
        this.IdEditar=data.id
        this.nombrefile=data.titulo
      }
    }
  }
  Eliminar(i:number,item:any){
    console.log(i)
    console.log(item)
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        if(item.tipo=='Cuestionario'){
          this._PEspecificoEsquemaService.EliminarPEspecificoSesionCuestionario(item.id).pipe(takeUntil(this.signal$)).subscribe({
          next: (x:any) => {
          },
          complete:()=>{
            this._SnackBarServiceService.openSnackBar("El cuestionario se ha eliminado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
            this.ObtenerActividadesRecursoSesionDocente();

          }
          });
        }
        if(item.tipo=='Material Adicional'){
          this._PEspecificoEsquemaService.EliminarPEspecificoSesionMaterialAdicional(item.id).pipe(takeUntil(this.signal$)).subscribe({
            next: (x:any) => {
            },
            complete:()=>{
              this._SnackBarServiceService.openSnackBar("El material adicional se ha eliminado correctamente.",
              'x',
              10,
              "snackbarCrucigramaSucces")
              this.ObtenerActividadesRecursoSesionDocente();

            }
          });
        }
        console.log(item.tipo)
        if(item.tipo=='Tarea'){
          console.log('INGRESO')
          this._PEspecificoEsquemaService.EliminarPEspecificoSesionTarea(item.id).pipe(takeUntil(this.signal$)).subscribe({
            next: (x:any) => {
            },
            complete:()=>{
              this._SnackBarServiceService.openSnackBar("La tarea se ha eliminado correctamente.",
              'x',
              10,
              "snackbarCrucigramaSucces")
              this.ObtenerActividadesRecursoSesionDocente();
            }
          });
        }
      }
    });
  }
  Agregar(){
    console.log(this.ActividadSelect)
    var data:any
    this.esquemas.forEach(element => {
      if(element.id==this.ActividadSelect){
        data=element;
      }
    });
    if(data.id==1){
      const dialogRef = this.dialog.open(AgregarTareaComponent, {
        width: '1000px',
        data: {id:0 ,idCriterio:data.idCriterio,sesion:this.sesion},
        panelClass: 'dialog-Agregar-Tarea',
       disableClose:true
      });

      dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
        console.log(result)
        if(result!=undefined && result.length>0){
          this.charge = true;
          this.ObtenerActividadesRecursoSesionDocente()
        }
      });
    }else{
      const dialogRef = this.dialog.open(AgregarCuestionarioComponent, {
        width: '1000px',
        data: {id:0 ,idCriterio:data.idCriterio,sesion:this.sesion},
        panelClass: 'dialog-Agregar-Tarea',
        disableClose:true
      });

      dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
        console.log(result)
        if(result!=undefined && result.length>0){
          this.charge = true;
          this.ObtenerActividadesRecursoSesionDocente()
        }
      });
    }
  }
  getFileDetails(event:any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus=true
      var name = event.target.files[i].name;
      this.nombrefile=name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>15){
        this.fileErrorMsg='El tamaño del archivo no debe superar los 15 MB'
        this.filestatus=false
      }
      this.selectedFiles = event.target.files;
      console.log((size/1024)/1024)
      console.log(this.fileErrorMsg)
      console.log(this.filestatus)
    }
  }
  AgregarPEspecificoSesionMaterialAdicional(){
    this.saveMaterial.Id=this.IdEditar
    this.charge = true;
    this.saveMaterial.IdPEspecificoSesion=this.IdSesion;
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.saveMaterial.file = file;
      }
    }
    this._PEspecificoEsquemaService.AgregarPEspecificoSesionMaterialAdicional(this.saveMaterial).pipe(takeUntil(this.signal$))
    .subscribe({
      next:x=>{
        if (x.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * x.loaded / x.total);
          console.log(this.progress)
        } else if (x instanceof HttpResponse) {
          this.progress=0;
          this.filestatus=false;
          this.fileErrorMsg='';
          this.nombrefile=''
          this.ObtenerActividadesRecursoSesionDocente();
          this.materialAdicional=false;
          this.ActividadSelect=-1;
          this.IdEditar=null;
        }

      },
      error:x=>{
        this.progress=0;

      }
    });

  }
}
