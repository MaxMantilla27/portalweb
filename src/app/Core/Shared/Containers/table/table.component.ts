import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit,AfterViewInit,OnChanges {

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
  @Output() ButtonClick= new EventEmitter<number>();
  @Output() ButtonArrayClick= new EventEmitter<{indexButton:number,index:number}>();
  dataSource :any;
  objectKeys = Object.keys;
  public select=-1
  public lengthInicial=0
  ngOnInit(): void {
    console.log(this.tableData);
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
    console.log(this.tableData.length)
    if(this.tableData.length!=this.lengthInicial){
      var i=0
      this.tableData.forEach((t:any) => {
        t.index=i;
        i++
      });
      this.dataSource = new MatTableDataSource(this.tableData);
      this.changeDetectorRefs.detectChanges();
    }
  }
  IsArray(Element:any){
    return Array.isArray(Element);
  }
}
