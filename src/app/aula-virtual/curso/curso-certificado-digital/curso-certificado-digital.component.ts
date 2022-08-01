import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { pipe, Subject, takeUntil } from 'rxjs';
import { CertificadoIntegraService } from 'src/app/Core/Shared/Services/CertificadoIntegra/certificado-integra.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-curso-certificado-digital',
  templateUrl: './curso-certificado-digital.component.html',
  styleUrls: ['./curso-certificado-digital.component.scss']
})
export class CursoCertificadoDigitalComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _CertificadoIntegraService:CertificadoIntegraService,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() datosCertificado:any;
  @Input() curso:any;
  @Input() changeOnGenerate=true
  @Output() OnGenerate = new EventEmitter<void>();
  public charge=false
  ngOnInit(): void {
  }

  GenerarCertificadoPorAlumnoIdMatriculaCabecera(){
    console.log(1)
    this.charge=true
    this._CertificadoIntegraService.GenerarCertificadoPorAlumnoIdMatriculaCabecera(this.datosCertificado.idMatriculaCabecera)
    .pipe(takeUntil(this.signal$))
    .subscribe({
      next:x=>{
        console.log(x)
        this.charge=false
        this.OnGenerate.emit()
      },
      error:x=>{
        console.log(x)
        this.charge=false
        this._SnackBarServiceService.openSnackBar("Ocurio un error , comuniquese con su asesor",'x',10,"snackbarCrucigramaerror");
      }
    })
  }
  GenerarCertificadoPorAlumnoPortalWebPorIdMatricula(){
    console.log(1)
    this.charge=true
    this._CertificadoIntegraService.GenerarCertificadoPorAlumnoPortalWebPorIdMatricula(this.datosCertificado.idMatriculaCabecera)
    .pipe(takeUntil(this.signal$))
    .subscribe({
      next:x=>{
        console.log(x)
        this.charge=false

        this.OnGenerate.emit()
      },
      error:x=>{
        console.log(x)
        this.charge=false
        this._SnackBarServiceService.openSnackBar("Ocurio un error , comuniquese con su asesor",'x',10,"snackbarCrucigramaerror");
      }
    })
  }

}
