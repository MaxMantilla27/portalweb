import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatoAdicionalBeneficioDTO, DetallesDatoAdicionalDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss']
})
export class BeneficiosComponent implements OnInit {
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _BeneficiosService: BeneficioService,
    private _ProgramaContenidoService: ProgramaContenidoService,
  ) {this.userForm =fb.group({
    Identificador: [''],
    Codigo: [''],
    Usuario: [''],
    Clave: [''],
    CorreoAsociado: [''],
  }); }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  public isCollapsed=true;
  public CodigoMatricula='';
  public IdBeneficio=0;
  public IdBeneficioDetalle=0;
  public Beneficios:Array<any>=[];

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
        console.log(this.Beneficios);
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
    this.DetalleBeneficiosEnvio.contenido=this.userForm.get('Contenido')?.value;
    this.DatosBeneficiosEnvio.datosAdicionales.push(this.DetalleBeneficiosEnvio);
    console.log(this.DetalleBeneficiosEnvio.contenido)
    this._BeneficiosService.AgregarDetalleDatosAdicionales(this.DatosBeneficiosEnvio).subscribe({
      next: (x) => {
      },
    })
}
}
