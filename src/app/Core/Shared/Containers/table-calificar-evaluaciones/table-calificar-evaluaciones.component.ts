import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Basic } from 'src/app/Core/Models/BasicDTO';
@Component({
  selector: 'app-table-calificar-evaluaciones',
  templateUrl: './table-calificar-evaluaciones.component.html',
  styleUrls: ['./table-calificar-evaluaciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableCalificarEvaluacionesComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef
    ) { }
  @Input() tableData:any;
  @Input() columnHeader:any;
  @Input() StyleCabecera=''
  @Input() StyleContent=''
  @Input() tipoContenido:any;
  @Input() sticky:any={};
  @Input() buttonheader:any={};
  @Input() DisableSort:any;
  @Input() DisableCell:any={};
  @Input() tipoContenidoHeader:any;
  @Output() ButtonClick= new EventEmitter<number>();
  @Output() ButtonArrayClick= new EventEmitter<{indexButton:number,index:number}>();
  @Output() ButtonHeaderClick= new EventEmitter<any>();
  @Output() SelectChange= new EventEmitter<{index:number,value:any,column:string}>();
  dataSource :any;
  objectKeys = Object.keys;
  public select=-1
  public lengthInicial=0
  @Input() dataSelect:Array<Basic>=[]
  ngOnInit(): void {
    var i=0
    this.tableData.forEach((t:any) => {
      t.index=i;
      i++
    });
    this.lengthInicial=this.tableData.length;
    this.dataSource = new MatTableDataSource(this.tableData);
    //this.dataSource.sort = this.sort;
  }
  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data:any, col:any) => {
      if (this.DisableSort!=undefined && this.DisableSort[col]!=undefined) {
        return false;
      }
      return data[col];
    };
    this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (length<(page + 1) * pageSize)?length:(page + 1) * pageSize;
      return `Pagina ${page+1} de ${Math.ceil(length/pageSize)}`;
      // return `pag${start} - ${end} de ${length}`;
    };
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.tableData.length!=this.lengthInicial){
      var i=0
      this.tableData.forEach((t:any) => {
        t.index=i;
        i++
      });
      this.dataSource = new MatTableDataSource(this.tableData);
      this.changeDetectorRefs.detectChanges();

      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data:any, col:any) => {
        if (this.DisableSort!=undefined && this.DisableSort[col]!=undefined) {
          return false;
        }
        return data[col];
      };
    }
  }
  IsArray(Element:any){
    return Array.isArray(Element);
  }
  isSticky(colum:string){
    return this.sticky[colum]!=undefined
  }
  FilterCodigoMatricula(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {
      return data.codigoMatricula.toLocaleString().toLocaleLowerCase().includes(filter);
    };
  }
  FilterAlumno(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {
      return data.alumno.toLocaleString().toLocaleLowerCase().includes(filter);
    };
  }
  FilterFechaEntrega(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {
      return data.fechaEnvio.toLocaleString().toLocaleLowerCase().includes(filter);
    };
  }
  FilterFechaCalificacion(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {
      return data.fechaCalificacion.toLocaleString().toLocaleLowerCase().includes(filter);
    };
  }
}
