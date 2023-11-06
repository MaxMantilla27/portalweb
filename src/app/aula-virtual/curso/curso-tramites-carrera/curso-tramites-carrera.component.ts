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

  @Input() IdMatricula=0;
  public tramitesSolicitado:any
  public ImgCarrera:any
  public InformacionPersonal=false
  public certificadoEstudios=false
  public DiplomaBachiller=false
  public tituloProfesional=false
  public certificadoIdioma=false
  public constanciaMatricula=false

  public cambio=false
  ngOnInit(): void {
  }
  Changes(i:number){
    this.change=true

    if(i==1)this.certificadoEstudios=true;
    if(i==2)this.DiplomaBachiller=true;
    if(i==3)this.tituloProfesional=true;
    if(i==4)this.InformacionPersonal=true;
    if(i==5)this.certificadoIdioma=true;
    if(i==6)this.constanciaMatricula=true;
  }
  ChangesVolver(i:number){
    this.change=false

    this.certificadoEstudios=false;
    this.DiplomaBachiller=false;
    this.tituloProfesional=false;
    this.InformacionPersonal=false;
    this.certificadoIdioma=false;
    this.constanciaMatricula=false;
    if(i==4){
      this.ObtenerImagenAlumno()
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
      this.ObtenerTramitesSolicitadosPorMatricula();
      this.ObtenerImagenAlumno()
    }
  }
  ObtenerTramitesSolicitadosPorMatricula(){
    this._DatosPerfilService.ObtenerTramitesSolicitadosPorMatricula(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.tramitesSolicitado=x;
      }
    })
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ObtenerImagenAlumno(){
    this._CertificadoService.ObtenerImagenAlumno(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.ImgCarrera=x;
      }
    })
  }
}
