import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { CalificarTareaAlumnoOnlineDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { LineamientosTareaOnlineComponent } from './lineamientos-tarea-online/lineamientos-tarea-online.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calificar-tarea-docente',
  templateUrl: './calificar-tarea-docente.component.html',
  styleUrls: ['./calificar-tarea-docente.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CalificarTareaDocenteComponent implements OnInit,OnChanges , OnDestroy,AfterViewInit{


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() Id = 0;
  @Input() data:any;

  @Output()
  Volver = new EventEmitter<void>();
  dataSource :any;
  public file:any;

  public selectedFiles?: FileList;
  public nombrefile='Ningún archivo seleccionado'
  public subir=false;
  public UrlArchivo=''
  public json:Array<CalificarTareaAlumnoOnlineDTO>=[]
  constructor(
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    private _SnackBarServiceService:SnackBarServiceService,
    public dialog: MatDialog,
    ) { }

    columnsToDisplay = ['codigo', 'nombre', 'entrega', 'archivo', 'version', 'calificacion', 'nota','retro'];
    expandedElement=-1;
    public Notas:Array<any>=[]
  ngOnInit(): void {
    for (let index = 0; index <= 10; index++) {
      this.Notas.push(index*10)
    }
  }
  cargando=false
  ngAfterViewInit (){

    this.paginator._intl.itemsPerPageLabel = 'Ítems por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (length<(page + 1) * pageSize)?length:(page + 1) * pageSize;
      return `Página ${page+1} de ${Math.ceil(length/pageSize)}`;
      // return `pag${start} - ${end} de ${length}`;
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data)
    if (this.Id != 0) {
      this.ObtenerListaTareaAlumnoOnline();
    }
  }
  public tableData:Array<any>=[]
  ObtenerListaTareaAlumnoOnline(){
    this.cargando=true
    this._PEspecificoEsquemaService.ObtenerListaTareaAlumnoOnline(this.Id).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x!=null && x!=undefined){
          this.tableData=x
        }
        let i=0
        this.tableData.forEach((t:any) => {
          t.index=i
          t.selectedFiles=new File([], '');
          t.filestatus=false,
          t.fileErrorMsg=''
          t.ArchivoAdjunto=false
          if(t.nombreArchivoRetroalimentacion==null){
            t.nombreArchivoRetroalimentacion='Ningún archivo seleccionado'
          }
          i++
        });
        console.log(this.tableData)
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cargando=false
        console.log(this.dataSource)
      }
    });
  }
  Expand(index:number,indice:any){
    console.log(indice)
    this.expandedElement = this.expandedElement  ==index ? -1 : index
  }
  SetNota(item:any){
    console.log(item)
    this.tableData.forEach((t:any) => {
      if(t.id==item.id){
        t.nota=item.nota
        t.editado=true
      }
    });
    console.log(this.tableData)
  }
  SetRetro(item:any){
    console.log(this.dataSource)
    console.log(item)
    this.tableData.forEach((t:any) => {
      if(t.id==item.id){
        t.retroalimentacion=item.retroalimentacion
        t.editado=true
      }
    });
    console.log(this.tableData)
  }

  getFileDetails(event:any,item:any) {
    for (var i = 0; i < event.target.files.length; i++) {
      var name = event.target.files[i].name;
      this.nombrefile=name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>150){
        item.fileErrorMsg='El tamaño del archivo no debe superar los 25 MB'
      }
      this.selectedFiles = event.target.files;
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
          item.selectedFiles = file;
          item.filestatus=true
          item.nombreArchivoRetroalimentacion=this.nombrefile
        }
      }
      console.log(this.dataSource)
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  SetFile(item:any){
    console.log(this.dataSource)
    console.log(item)
    item.ArchivoAdjunto=true
    this.tableData.forEach((t:any) => {
      if(t.id==item.id){
        t.selectedFiles=item.selectedFiles
        t.ArchivoAdjunto=true
        t.editado=true
      }
    });
    console.log(this.tableData)
    this._SnackBarServiceService.openSnackBar("Se adjunto el archivo",'x',15,"snackbarCrucigramaSucces");
  }
  CalificarTareaAlumnoOnline(){
    this.cargando=true
    this.json=[]
    this.tableData.forEach((t:any) => {
      if(t.editado==true){
        if(t.nota!=null){
          this.json.push({
            Id:t.id,
            Nota:t.nota,
            file:t.selectedFiles.name!=''?t.selectedFiles:new File([], ''),
            Retroalimentacion:t.retroalimentacion
          })
        }
      }
    });
    if(this.json.length>0){
      this._PEspecificoEsquemaService.CalificarTareaAlumnoOnline(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          if (x.type === HttpEventType.UploadProgress) {
            console.log(Math.round((100 * x.loaded) / x.total));
          } else if (x instanceof HttpResponse) {
            this._SnackBarServiceService.openSnackBar("Se calificaron las notas",'x',15,"snackbarCrucigramaSucces");
            this.ObtenerListaTareaAlumnoOnline()
          }
        },
        error: (x) => {},
      });
    }else{

      this.cargando=false
      this._SnackBarServiceService.openSnackBar("No existe ninguna tarea modificada",'x',15,"snackbarCrucigramaerror");
    }
  }

  Open(name:string){
    this.dialog.open(LineamientosTareaOnlineComponent, {
      width: '1200px',
      panelClass: 'dialog-lineamisnto-tarea',
      data:{title:name},
     disableClose:true
    });

  }
}
