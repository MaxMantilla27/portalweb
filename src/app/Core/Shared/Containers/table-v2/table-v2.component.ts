import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Basic } from 'src/app/Core/Models/BasicDTO';
@Component({
  selector: 'app-table-v2',
  templateUrl: './table-v2.component.html',
  styleUrls: ['./table-v2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableV2Component implements OnInit {

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
  @Input() EsButton:any={};
  @Input() tipoContenidoHeader:any;
  @Output() ButtonClick= new EventEmitter<number>();
  @Output() ButtonArrayClick= new EventEmitter<{indexButton:number,index:number}>();
  @Output() ButtonHeaderClick= new EventEmitter<any>();
  @Output() SelectChange= new EventEmitter<{index:number,value:any,column:string}>();
  @Output() EsButtonNormal= new EventEmitter<number>();
  @Input() Paginador=true;
  @Input() ColSpan:Array<any>=[];
  @Input() ColorHeader=false;
  dataSource :any;
  objectKeys = Object.keys;
  public select=-1
  public lengthInicial=0
  @Input() dataSelect:Array<Basic>=[]
  public datacolspa:Array<string>=[]
  public columnas:Array<any>=[]
  public hide:any={}
  ngOnInit(): void {
    console.log(this.tipoContenido[this.tableData])
    console.log(this.columnHeader)
    console.log(this.ColSpan)
    var i=0
    this.tableData.forEach((t:any) => {
      t.index=i;
      i++
    });
    this.lengthInicial=this.tableData.length;
    this.dataSource = new MatTableDataSource(this.tableData);


    if(this.ColSpan.length>0){
      for (let index = 0; index < this.objectKeys(this.columnHeader).length; index++) {
        console.log(index)
        var existe=false;

        this.ColSpan.forEach((c:any) => {
          console.log(c)
          if(index+1>=c.inicio &&
            // index+1<=(c.inicio+c.colspam
            (c.id==4 || c.id==19 || c.id==20 || c.id==21||c.id==28 ||c.id==35 ||c.id==36
             )){

            existe=true
          }
        });
        console.log(existe)
        console.log(this.columnHeader[this.objectKeys(this.columnHeader)[index]])
        if(existe==false){
          this.hide[this.objectKeys(this.columnHeader)[index]]=true
          console.log(this.columnHeader)
          console.log(this.columnHeader[this.objectKeys(this.columnHeader)[index]])
          this.columnas.push({id:0,inicio: index,nombre: this.columnHeader[this.objectKeys(this.columnHeader)[index]],colspam: 1})
        }
      }
      this.ColSpan.forEach((c:any) => {
        console.log(c)
        this.columnas.push(c)
      });
      let j=0
      this.columnas.sort(function (a, b) {
        return a.inicio - b.inicio;
      });
      this.columnas.forEach((c:any) => {
        this.datacolspa.push('c'+j)
        j++
      });
      console.log(this.columnas)
      console.log(this.hide)
      console.log(this.datacolspa)
    }
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
    if(this.Paginador==true){
      this.paginator._intl.itemsPerPageLabel = 'Ítems por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        const start = page * pageSize + 1;
        const end = (length<(page + 1) * pageSize)?length:(page + 1) * pageSize;
        return `Página ${page+1} de ${Math.ceil(length/pageSize)}`;
        // return `pag${start} - ${end} de ${length}`;
      };
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.tableData)
    console.log(this.tipoContenido[this.tableData])


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
}
