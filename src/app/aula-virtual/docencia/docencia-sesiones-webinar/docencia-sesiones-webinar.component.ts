import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProgramaEspecificoIntegraService } from 'src/app/Core/Shared/Services/ProgramaEspecificoIntegra/programa-especifico-integra.service';

@Component({
  selector: 'app-docencia-sesiones-webinar',
  templateUrl: './docencia-sesiones-webinar.component.html',
  styleUrls: ['./docencia-sesiones-webinar.component.scss']
})
export class DocenciaSesionesWebinarComponent implements OnInit ,OnChanges,OnDestroy{
  private signal$ = new Subject();
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
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() IdProveedor=0;
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdProveedor>0){
      this.ObtenerSesionesOnlineWebinarPorProveedor()
    }
  }
  ObtenerSesionesOnlineWebinarPorProveedor(){
    this._ProgramaEspecificoIntegraService.ObtenerSesionesOnlineWebinarPorProveedor(this.IdProveedor).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.tableData=x
        console.log(x)
        this.tableData.forEach((e:any) => {
          e.Acciones=e.UrlWebex==null?'Próximamente':'Unirse'
        });
      }
    })
  }
}
