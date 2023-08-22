import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-portal',
  templateUrl: './table-portal.component.html',
  styleUrls: ['./table-portal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TablePortalComponent implements OnInit,AfterViewInit,OnChanges{

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef) { }
  @Input() tableInfo:any;
  @Input() columnHeader:any;
  @Input() StyleCabecera=''
  @Input() StyleContent=''
  @Input() tipoContenido:any;
  @Output() ButtonClick= new EventEmitter<number>();
  @Output() ButtonArrayClick= new EventEmitter<{indexButton:number,index:number}>();
  dataSource :any;
  objectKeys = Object.keys;
  public select=-1
  public lengthInicial=0
  ngOnInit(): void {
    console.log(this.tableInfo)
    var i = 0
    this.tableInfo.forEach((t:any) => {
      t.index=i;
      i++
    });
    this.lengthInicial=this.tableInfo.length;
    this.dataSource = new MatTableDataSource(this.tableInfo);
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Ítems por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (length<(page + 1) * pageSize)?length:(page + 1) * pageSize;
      return `Página ${page+1} de ${Math.ceil(length/pageSize)}`;
      // return `pag${start} - ${end} de ${length}`;
    };
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.tableInfo.length)
    if(this.tableInfo.length!=this.lengthInicial){
      var i=0
      this.tableInfo.forEach((t:any) => {
        t.index=i;
        i++
      });
      this.dataSource = new MatTableDataSource(this.tableInfo);
      this.changeDetectorRefs.detectChanges();
    }
  }
  IsArray(Element:any){
    return Array.isArray(Element);
  }

}
