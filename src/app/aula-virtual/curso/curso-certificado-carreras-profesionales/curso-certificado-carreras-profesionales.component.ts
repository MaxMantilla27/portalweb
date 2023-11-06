import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-curso-certificado-carreras-profesionales',
  templateUrl: './curso-certificado-carreras-profesionales.component.html',
  styleUrls: ['./curso-certificado-carreras-profesionales.component.scss']
})
export class CursoCertificadoCarrerasProfesionalesComponent implements OnInit ,OnDestroy {

  private signal$ = new Subject();
  public charge=false

  constructor(
  ) { }

  @Input() IdMatricula=0;

  public CertificadoEstudios=false
  public DiplomaBachiller=false
  public TituloProfesional=false
  public CertificadoSeleccionado=false

  public cambio=false
  ngOnInit(): void {
  }
  Changes(i:number){
    this.charge=true
    this.CertificadoEstudios=false;
    this.DiplomaBachiller=false;
    this.TituloProfesional=false;
    if(i==1){
      this.CertificadoEstudios=true;
      this.CertificadoSeleccionado=true;
    }
    if(i==2){
      this.DiplomaBachiller=true;
      this.CertificadoSeleccionado=true;
    }
    if(i==3){
      this.TituloProfesional=true;
      this.CertificadoSeleccionado=true;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0 && !this.charge){
    }
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  RefrescarCertificados(){
    console.log('==================RECARGANDO CERTIFICADOS============')
    this.CertificadoEstudios=false;
    this.DiplomaBachiller=false;
    this.TituloProfesional=false;
    this.CertificadoSeleccionado=false;
  }
}
