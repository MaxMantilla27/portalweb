import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MisPostulacionesComponent } from '../mis-postulaciones/mis-postulaciones.component';
import { error } from '@angular/compiler/src/util';
import {MatChipsModule} from '@angular/material/chips';


@Component({
  selector: 'oferta-laboral',
  templateUrl: './oferta-laboral.component.html',
  styleUrls: ['./oferta-laboral.component.scss']
})
export class OfertaLaboralComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _OfertaLaboralService:OfertaLaboralService,
    private _HelperService:HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
  ) { }
  listaConvocatorias:any[]=[]
  listaConvocatoriasOriginal:any[]=[]
  dataAlumno:any
  dataTemp :any=null
  buscando=false
  
  public inputNombre="";
  selected: { [id: number]: boolean } = {
    1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,
  };
  @Output()
  MisPostulaciones = new EventEmitter<number>();
  @Output()
  Actualizar = new EventEmitter<void>();


  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ngOnInit(): void {
    this.selected={
      1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,
    };
    this.ObtenerConvocatoriasVigentes()
  }

  ObtenerConvocatoriasVigentes(){
    this._OfertaLaboralService.ObtenerConvocatoriasVigentes().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        x.forEach((e:any)=>{
          e.fechaFin = new Date(e.fechaFin)
          e.fechaInicio = new Date(e.fechaInicio)
          e.isSelect=false
        })
        this.listaConvocatoriasOriginal=x
        this.listaConvocatorias=x
        if(this.listaConvocatorias.length>0){
          this.listaConvocatorias[0].isSelect=true
          this.mostrarConvocatoria(this.listaConvocatorias[0])
        }
      }
    })
  }

  

  ObtenerDetalleConvocatorias(data:any){
    this.buscando=true
    this._OfertaLaboralService.ObtenerDetalleConvocatorias(data.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        data.stringIdiomas =x.idiomas.length>0? x.idiomas.map((e:any) => e.nombre).join(", "):""
        data.stringNivelEstudio =x.nivelEstudio.length>0? x.nivelEstudio.map((e:any) => e.nombre).join(", "):""
        data.stringExperiencia =x.experiencia.length>0? x.experiencia.map((e:any) => e.nombre).join(", "):""
        this.dataTemp=data
        this.buscando=false
      }
    })
  }

  ObtenerDatosAlumno(){
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.dataAlumno = x.datosAlumno
    })
  }

  mostrarConvocatoria(data:any){
    data.isSelect=true
    this.listaConvocatorias.forEach((e:any)=>{
      if(e.id!=data.id) e.isSelect=false
    })
    this.ObtenerDetalleConvocatorias(data)
    
  }

  postular()
  {
    this._OfertaLaboralService.ValidarPostulacion(this.dataTemp.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if(x==true){
          this._OfertaLaboralService.ObtenerCVAlumno().pipe(takeUntil(this.signal$)).subscribe({
            next:rCV=>{
              if(rCV.nombreArchivo!=null && rCV.nombreArchivo!=null && rCV.urlArchivo!=null && rCV.urlArchivo!=null){
                this._OfertaLaboralService.RegistrarPostulacionAlumno(this.dataTemp.id).pipe(takeUntil(this.signal$)).subscribe({
                  next:x=>{
                      if(x==true){
                        this._SnackBarServiceService.openSnackBar(
                          "Has completado exitosamente tu postulación a esta oferta laboral.!",
                          'x',
                          10,
                          "snackbarCrucigramaSucces");
                          this.Actualizar.emit()
                          this.dataTemp.isPostulado=true;
                      }else
                      {
                        this._SnackBarServiceService.openSnackBar(
                          "Se produjo un error al intentar postular a esta oferta laboral.!",
                          'x',
                          10,
                          "snackbarCrucigramaerror");
                      }
                  }
                })
              }
              else{
                this._SnackBarServiceService.openSnackBar(
                  "No se ha registrado ningún CV, registra tu CV antes de postular",
                  'x',
                  10,
                  "snackbarCrucigramaerror");
              }
            }
            
          })
          
          }
        else{
          this._SnackBarServiceService.openSnackBar(
            "Has postulado previamente a esta oferta laboral.!",
            'x',
            10,
            "snackbarCrucigramaerror");
        }
        
      }
    })
  }

  redireccionarAMisPostulaciones(){
    this.MisPostulaciones.emit(this.dataTemp.id)
  }

  filtrarPorNombre(){
    this.inputNombre = this.inputNombre.trim()
    if(this.inputNombre!=""){
      for (let key in this.selected) {
        if (this.selected.hasOwnProperty(key)) {
          this.selected[key] = false;
        }
      }
      this.listaConvocatorias = this.listaConvocatoriasOriginal.filter((e:any)=>
        e.nombre.toLowerCase().includes(this.inputNombre.toLowerCase())
      )
    }
    else  this.listaConvocatorias = this.listaConvocatoriasOriginal
    
    if(this.listaConvocatorias.length>0){
      this.listaConvocatorias[0].isSelect=true
      this.mostrarConvocatoria(this.listaConvocatorias[0])
    }

  }

  cambioChipFiltro(chip:number,valor:boolean){
    this.inputNombre=""
    if (Object.values(this.selected).every((filtro) => filtro === false)) {
      this.listaConvocatorias = this.listaConvocatoriasOriginal;
    }else{
      let filtros: { id: number, filtro: (item: any) => boolean }[] = [
        { id: 1, filtro: (item: any) => item.idModalidadTrabajo == 1 },
        { id: 2, filtro: (item: any) => item.idModalidadTrabajo == 3 },
        { id: 3, filtro: (item: any) => item.idModalidadTrabajo == 2 },
        { id: 4, filtro: (item: any) => item.tipoJornada.toLowerCase() == "por horas" },
        { id: 5, filtro: (item: any) => item.tipoJornada.toLowerCase() == "parcial" },
        { id: 6, filtro: (item: any) => item.tipoJornada.toLowerCase() == "completo" },
        { id: 7, filtro: (item: any) => item.aplicaBono },
        { id: 8, filtro: (item: any) => item.aplicaComision }
      ];
      
      let listaUnida = this.listaConvocatoriasOriginal.filter((item: any) => {
        return filtros.every((filtro) => {
          return !this.selected[filtro.id] || filtro.filtro(item);
        });
      });
      
      let objetoRepetido = listaUnida.filter((objeto, index) => {
        return listaUnida.slice(index + 1).some((item) => item.id === objeto.id);
      });
      
      let listafinal = (objetoRepetido.length > 0) ? objetoRepetido : listaUnida;
      
      this.listaConvocatorias = listafinal.filter((objeto, index) => {
        return index === listafinal.findIndex((item) => item.id === objeto.id);
      });
    }

    if(this.listaConvocatorias.length>0){
      this.listaConvocatorias[0].isSelect=true
      this.mostrarConvocatoria(this.listaConvocatorias[0])
    }
    
   
  }

}

