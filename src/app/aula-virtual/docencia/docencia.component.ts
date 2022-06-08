import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';

@Component({
  selector: 'app-docencia',
  templateUrl: './docencia.component.html',
  styleUrls: ['./docencia.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaComponent implements OnInit {

  constructor(
    private _ProveedorService:ProveedorService
  ) { }

  public migaPan = [
    {
      titulo: 'Docencia',
      urlWeb: '/AulaVirtual/Docencia',
    }
  ];
  public tabIndex = 0;
  public hide=false
  public DataProveedor:any
  public dataForo:any
  ngOnInit(): void {
    this.ObtenerInformacionProveedor();
    this.ObtenerForoProveedor();
  }
  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().subscribe({
      next:x=>{
        console.log(x)
        this.DataProveedor=x
      }
    })
  }
  ObtenerForoProveedor(){
    this._ProveedorService.ObtenerForoProveedor().subscribe({
      next:x=>{
        console.log(x)
        this.dataForo=x
      }
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {

  }
}
