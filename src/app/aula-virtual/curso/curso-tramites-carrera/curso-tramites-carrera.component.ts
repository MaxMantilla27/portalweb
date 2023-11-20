import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-curso-tramites-carrera',
  templateUrl: './curso-tramites-carrera.component.html',
  styleUrls: ['./curso-tramites-carrera.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoTramitesCarreraComponent implements OnInit ,OnDestroy {

  private signal$ = new Subject();
  public change=false

  constructor(
    private _DatosPerfilService: DatosPerfilService,
    private _CertificadoService:CertificadoService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() IdMatricula=0;
  @Input() IdPGeneral=0;
  public tramitesSolicitado:any
  public InformacionPersonal=false
  public certificadoEstudios=false
  public DiplomaBachiller=false
  public tituloProfesional=false
  public certificadoIdioma=false
  public constanciaMatricula=false

  public cambio=false
  public TramitesCurso:Array<any>=[];
  public TramiteSeleccionado:any;

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdMatricula)
    console.log(this.IdPGeneral)
    if(this.IdMatricula!=0){
      this.ObtenerTramitesSolicitadosPorMatricula();
      this.ObtenerTramitesMatricula();
    }
  }
  Changes(i:number){
    this.change=true
    console.log(this.TramitesCurso)
    if(i==1){
      this.certificadoEstudios=true;
      this.TramitesCurso.forEach((y:any)=>{
        if(y.concepto.toUpperCase().includes('EMISIÓN DE CERTIFICADO DE EGRESADO'))
        {
          console.log(y)
          y.pagar=true;
          this.TramiteSeleccionado=y;
        }
      })
      console.log(this.TramiteSeleccionado)
    }
    if(i==2){
      this.DiplomaBachiller=true;
      this.TramitesCurso.forEach((y:any)=>{
        if(y.concepto.toUpperCase().includes('EMISIÓN DE DIPLOMA DE GRADO DE BACHILLER'))
        {
          y.pagar=true;
          this.TramiteSeleccionado=y;
        }
      })
    }
    if(i==3){
      this.tituloProfesional=true;
      this.TramitesCurso.forEach((y:any)=>{
        if(y.concepto.toUpperCase().includes('EMISIÓN DE TÍTULO PROFESIONAL TÉCNICO'))
        {
          y.pagar=true;
          this.TramiteSeleccionado=y;
        }
      })
    }
    if(i==4){
      this.InformacionPersonal=true;
    }
    if(i==5){
      this.certificadoIdioma=true;
    }
    if(i==6){
      this.constanciaMatricula=true;
      this.TramitesCurso.forEach((y:any)=>{
        if(y.concepto.toUpperCase().includes('EMISIÓN DE CONSTANCIA DE MATRÍCULA'))
        {
          y.pagar=true;
          this.TramiteSeleccionado=y;
        }
      })
    }
  }
  ChangesVolver(i:number){
    this.change=false
    this.TramiteSeleccionado=undefined
    this.certificadoEstudios=false;
    this.DiplomaBachiller=false;
    this.tituloProfesional=false;
    this.InformacionPersonal=false;
    this.certificadoIdioma=false;
    this.constanciaMatricula=false;
    this.TramitesCurso.forEach((y:any)=>{
      y.pagar=false;
    })
  }

  ObtenerTramitesSolicitadosPorMatricula(){
    this._DatosPerfilService.ObtenerTramitesSolicitadosPorMatricula(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.tramitesSolicitado=x;
      }
    })
  }



  ObtenerTramitesMatricula(){
    this._DatosPerfilService.ListaTramiteAdministrativoProgramaMatriculadoRegistradoCarreras(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        if(x.length>0){
          this.TramitesCurso=x;
          this.TramitesCurso.forEach((y:any)=>{
            y.pagar=false;
          })
          console.log(this.TramitesCurso)
        }
      }
    })
  }
}
