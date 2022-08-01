import { Component, Input, NgModule, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BeneficiosContenidoDTO, DatoAdicionalBeneficioDTO, DetallesDatoAdicionalDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss']
})
export class BeneficiosComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private _BeneficiosService: BeneficioService,
    private _ProgramaContenidoService: ProgramaContenidoService,
  ) {
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public CodigoMatricula='';
  public BeneficioPendiente=-1;
  public AyudaBeneficio=1;
  public Beneficios:Array<any>=[];
  public DatosBeneficiosEnvio:DetallesDatoAdicionalDTO={
    id:0,
    idMatriculaCabeceraBeneficios:0,
    idMatriculaCabecera:0,
    codigoMatricula:'',
    datosAdicionales:[],
  }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
      this.ObtenerBeneficiosMatricula();
      this.ObtenerCodigoMatricula();
    }
  }
  ObtenerBeneficiosMatricula(){
    this._BeneficiosService.ListaBeneficioMatriculaAlumnoActivo(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.Beneficios=x
        console.log(this.Beneficios)
        this.Beneficios.forEach((y:any)=>{
          y.listaDatosAdicionales.forEach((z:any)=>{
            z.value=''
            z.valid=true
          })
        })
      }
    })
  }
  ObtenerCodigoMatricula(){
    this._ProgramaContenidoService.ObtenerCodigoMatriculaAlumno(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.CodigoMatricula=x.codigoMatricula;
      },
    })
  }

  EnviarRegistroBeneficio(i:number){
    this.RecorrerContenidoBeneficio(i);
    this._BeneficiosService.AgregarDetalleDatosAdicionales(this.DatosBeneficiosEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
      },
      complete: () => {
        this.ObtenerBeneficiosMatricula();
      },
    })

  }
  RecorrerContenidoBeneficio(i:number){
    this.DatosBeneficiosEnvio.datosAdicionales=[]
    this.Beneficios[i].listaDatosAdicionales.forEach((y:any)=>{
      console.log(this.Beneficios)
      if(y.value!=''){
        this.DatosBeneficiosEnvio.idMatriculaCabeceraBeneficios=this.Beneficios[i].id;
        this.DatosBeneficiosEnvio.idMatriculaCabecera=this.IdMatricula;
        this.DatosBeneficiosEnvio.codigoMatricula=this.CodigoMatricula;
          console.log(y.value)
      this.DatosBeneficiosEnvio.datosAdicionales.push({id:y.idDatoAdicional,contenido:y.value})
      }
    })
  }
}
