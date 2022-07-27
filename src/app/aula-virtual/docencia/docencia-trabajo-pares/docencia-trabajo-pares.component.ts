import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TrabajoDeParesActualizacion } from 'src/app/Core/Models/TrabajoDeParesActualizacionDTO';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';

@Component({
  selector: 'app-docencia-trabajo-pares',
  templateUrl: './docencia-trabajo-pares.component.html',
  styleUrls: ['./docencia-trabajo-pares.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaTrabajoParesComponent implements OnInit,OnDestroy,OnChanges {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    private _router:Router,
    private _ActivatedRoute:ActivatedRoute
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdProveedor>0){
      this.ObtenerProgramaGeneralCentroCostoDocenteCalificado()
      this.ObtenerProgramaGeneralCentroCostoDocenteNoCalificado()
    }
  }
  @Input() IdProveedor = 0;
  @Input() Correo = '';
  public trabajos:any
  public trabajosNocalificados:any

  columnHeader = {
    alumno: 'Alumno',
    estadoTarea : 'Estado',
    Acciones: 'Acciones',
  };

  TipoContenido: any = {
    Acciones: ['buttons', 'Calificar'],
    //'Acciones': ['buttons'],
  };
  ngOnInit(): void {
  }
  ObtenerProgramaGeneralCentroCostoDocenteNoCalificado(){
    this._TrabajoDeParesIntegraService.ObtenerProgramaGeneralCentroCostoDocente(this.IdProveedor,true).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.trabajosNocalificados=x
        this.trabajosNocalificados.forEach((t:any) => {
          t.alumnos=[]
        });
      }
    })
  }
  ObtenerProgramaGeneralCentroCostoDocenteCalificado(){
    this._TrabajoDeParesIntegraService.ObtenerProgramaGeneralCentroCostoDocente(this.IdProveedor,false).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.trabajos=x
        this.trabajos.forEach((t:any) => {
          t.alumnos=[]
        });
      }
    })
  }
  openTab(item:any,index:number,tipo:boolean){
    console.log(item)
    console.log(index)
    this._TrabajoDeParesIntegraService
      .ObtenerAlumnoTrabajoPares(this.IdProveedor,item.idPEspecificoPadre,item.idPGeneralPadre)
      .pipe(takeUntil(this.signal$))
      .subscribe({
      next:x=>{
        console.log(x)
        if(tipo==true){
          this.trabajos[index].alumnos=x
          this.trabajos[index].alumnos.forEach((a:any) => {
            a.estadoTarea="No calificado";
            if(a.calificado) {
              a.estadoTarea = "Calificado";
            }
          });
        }else{

          this.trabajosNocalificados[index].alumnos=x
          this.trabajosNocalificados[index].alumnos.forEach((a:any) => {
            a.estadoTarea="No calificado";
            if(a.calificado) {
              a.estadoTarea = "Calificado";
            }
          });
        }
      }
    });
  }
  ButtonsClick(index:any,indexAlumno:number,tipo:boolean){
    const urlTree = this._router.createUrlTree([], {
      relativeTo: this._ActivatedRoute
    });
    const Url =this._router.serializeUrl(urlTree);
    if(tipo==true){
      window.open(Url+'/'+this.trabajos[index].alumnos[indexAlumno].id, '_blank');
    }else{
      window.open(Url+'/'+this.trabajosNocalificados[index].alumnos[indexAlumno].id, '_blank');
    }
  }
}
