import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatoAdicionalBeneficioDTO, DetallesDatoAdicionalDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss']
})
export class BeneficiosComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _BeneficiosService: BeneficioService,
    private _ProgramaContenidoService: ProgramaContenidoService,
  ) {
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public BeneficioIngresado=false;
  public BeneficioPendiente=false;
  public CodigoMatricula='';
  public IdBeneficio=0;
  public IdBeneficioDetalle=0;
  public Beneficios:Array<any>=[];
  public ListaDatosAdicionales:Array<any>=[];
  public AyudaBeneficio=1;


  public DetalleBeneficiosEnvio: DatoAdicionalBeneficioDTO={
    id:0,
    contenido:''
  }
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
    this._BeneficiosService.ListaBeneficioMatriculaAlumnoActivo(this.IdMatricula).subscribe({
      next:x=>{
        this.Beneficios=x
        this.Beneficios.forEach((y:any)=>{
          y.listaDatosAdicionales.forEach((z:any)=>{
            z.value=''
            z.valid=true
          })
        })
        console.log(this.Beneficios);
        this.ListaDatosAdicionales=x.listaDatosAdicionales;
      }
    })
  }
  ObtenerCodigoMatricula(){
    this._ProgramaContenidoService.ObtenerCodigoMatriculaAlumno(this.IdMatricula).subscribe({
      next: (x) => {
        this.CodigoMatricula=x.codigoMatricula;
      },
    })
  }

  EnviarRegistroBeneficio(){

    this.DatosBeneficiosEnvio.idMatriculaCabeceraBeneficios=this.IdBeneficio;
    this.DatosBeneficiosEnvio.idMatriculaCabecera=this.IdMatricula;
    this.DatosBeneficiosEnvio.codigoMatricula=this.CodigoMatricula;

    this.DetalleBeneficiosEnvio.id=this.IdBeneficioDetalle;
    this.DatosBeneficiosEnvio.datosAdicionales.push(this.DetalleBeneficiosEnvio);
    console.log(this.DetalleBeneficiosEnvio)
    this._BeneficiosService.AgregarDetalleDatosAdicionales(this.DatosBeneficiosEnvio).subscribe({
      next: (x) => {
      },
    })
    console.log(this.BeneficioIngresado)
  }
  RecorrerBeneficio(value:any){
    console.log(value)
  }
  chageRadio(value:number){
    if(value==0){
      return 1;
    }
    return 0;
  }

}
