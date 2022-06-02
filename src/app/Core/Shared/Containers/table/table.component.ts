import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit,AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() { }
  @Input() tableData:any;
  @Input() columnHeader:any;
  @Input() StyleCabecera=''
  @Input() StyleContent=''
  @Input() tipoContenido:any;
  dataSource :any;
  objectKeys = Object.keys;
  public select=-1
  ngOnInit(): void {
    console.log(this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    console.log(this.tipoContenido)
    //this.dataSource.sort = this.sort;
  }
  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
