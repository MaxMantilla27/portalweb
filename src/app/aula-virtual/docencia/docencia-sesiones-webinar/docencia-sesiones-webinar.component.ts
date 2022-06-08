import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProgramaEspecificoIntegraService } from 'src/app/Core/Shared/Services/ProgramaEspecificoIntegra/programa-especifico-integra.service';

@Component({
  selector: 'app-docencia-sesiones-webinar',
  templateUrl: './docencia-sesiones-webinar.component.html',
  styleUrls: ['./docencia-sesiones-webinar.component.scss']
})
export class DocenciaSesionesWebinarComponent implements OnInit ,OnChanges{
  columnHeader = {
    'PEspecificoPadre': 'Nombre Programa',
    'CursoNombre': 'Nombre Curso',
    'FechaSesion': 'Fecha Inicio',
    'HoraSesion': 'Hora Inicio',
    'Tipo': 'Tipo Sesion',
    'Acciones': 'Acciones', };

  TipoContenido:any={
    'FechaSesion': ['date'],
    'Acciones': ['url','UrlWebex'],
    //'Acciones': ['buttons'],
  }
  tableData: any;
  constructor(
    private _ProgramaEspecificoIntegraService:ProgramaEspecificoIntegraService
  ) { }
  @Input() IdProveedor=0;
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdProveedor>0){
      this.ObtenerSesionesOnlineWebinarPorProveedor()
    }
  }
  ObtenerSesionesOnlineWebinarPorProveedor(){
    this._ProgramaEspecificoIntegraService.ObtenerSesionesOnlineWebinarPorProveedor(this.IdProveedor).subscribe({
      next:x=>{
        this.tableData=x
        this.tableData.forEach((e:any) => {
          e.Acciones=e.UrlWebex==null?'Próximamente':'Unirse'
        });
      }
    })
  }
}
