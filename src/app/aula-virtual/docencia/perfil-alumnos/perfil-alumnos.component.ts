import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilalumnosService } from 'src/app/Core/Shared/Services/PerfilAlumnos/perfilalumnos.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { Workbook } from 'exceljs';
import { ExcelService } from 'src/app/Core/Shared/Services/Excel/excel.service';

@Component({
  selector: 'app-perfil-alumnos',
  templateUrl: './perfil-alumnos.component.html',
  styleUrls: ['./perfil-alumnos.component.scss']
})
export class PerfilAlumnosComponent implements OnInit, OnChanges,OnDestroy {
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
      //'Acciones': ['buttons'],
  }
  tableInfo:any;
  workbook = new Workbook();


  constructor(
    private _Router:Router,
    private r:ActivatedRoute,
    private _SnackBarServiceService:SnackBarServiceService,
    private _PerfilAlumnosService:PerfilalumnosService,
    private excelService: ExcelService,
  ) { }



  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() IdPEspecifico=0;
  @Output() OnRecharge = new EventEmitter<void>();




  public PerfilAlumnos:any;

  ngOnInit(): void {
    this.ObtenerPerfilAlumnos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdPEspecifico>0){
      this.ObtenerPerfilAlumnos()
    }
  }

  ObtenerPerfilAlumnos(){
    this._PerfilAlumnosService.ObtenerPerfilAlumnos(18675).pipe(takeUntil(this.signal$)).subscribe({
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
