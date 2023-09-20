import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import { ExcelService } from 'src/app/Core/Shared/Services/Excel/excel.service';
import { PerfilalumnosService } from 'src/app/Core/Shared/Services/PerfilAlumnos/perfilalumnos.service';

@Component({
  selector: 'app-perfil-alumno-docente',
  templateUrl: './perfil-alumno-docente.component.html',
  styleUrls: ['./perfil-alumno-docente.component.scss']
})
export class PerfilAlumnoDocenteComponent implements OnInit ,OnChanges,OnDestroy {
  private signal$ = new Subject();
  columnHeader = {
    'numero'  : 'N°',
    'codigoMatricula': 'Código',
    'nombreAlumno': 'Nombre y Apellidos',
    'pais': 'País',
    'cargo': 'Cargo',
    'aFormacion': 'Area Formacion',
    'aTrabajo': 'Area Trabajo',
    'industria':'Industria',
  };
  TipoContenido:any={
  }

  public sticky:any={
    numero: true,
    codigoMatricula: true,
    nombreAlumno: true};
  tableInfo:any;
  @Input() IdPespecifico = 0;
  public PerfilAlumnos:any;

  constructor(
    private _PerfilAlumnosService:PerfilalumnosService,
    private excelService: ExcelService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdPespecifico)
    if(this.IdPespecifico>0){
      this.ObtenerPerfilAlumnos()
    }
  }
  workbook = new Workbook();

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  ngOnInit(): void {
  }


  ObtenerPerfilAlumnos(){
    console.log(this.IdPespecifico)
    this._PerfilAlumnosService.ObtenerPerfilAlumnos(this.IdPespecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.PerfilAlumnos=x;
        let i=1
        this.PerfilAlumnos.forEach((e:any)=> {
          e.index=i
          i++
        });
        this.tableInfo=x;
        i=1
        this.tableInfo.forEach((e:any)=> {
          e.numero=i
          i++
        });
        // console.log(this.PerfilAlumnos);
        console.log("Hola");
      }
    })
  }



  DownloadExcel(): void {
    const fileToExport = this.PerfilAlumnos.map((items:any) => {
      return {
       "N°": items?.index,
       "Código": items?.codigoMatricula,
       "Nombre y Apellidos": items?.nombreAlumno,
       "País": items?.pais,
       "Cargo": items?.cargo,
       "Area Formación": items?.aFormacion,
       "Area Trabajo": items?.aTrabajo,
       "Industria": items?.industria,
     }
    });

    this.excelService.exportToExcel(
     fileToExport,
     'PerfilAlumnos-' + new Date().getTime()
   );
  }
}
