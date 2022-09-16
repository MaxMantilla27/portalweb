import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';

@Component({
  selector: 'app-informacion-certificado',
  templateUrl: './informacion-certificado.component.html',
  styleUrls: ['./informacion-certificado.component.scss']
})
export class InformacionCertificadoComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _CertificadoService:CertificadoService,
    private activatedRoute:ActivatedRoute
  ) { }
  public idMatriculaCabecera:any;
  public codigoCertificado:any;
  public oncharge=false
  public infoCerti:any=undefined
  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatriculaCabecera = x['IdMatricula'];
        this.codigoCertificado = x['IdCertificado'];
        this.ObtenerInformacionAlumnoCertificado()
      },
      error: () => {
      },
    });
  }
  ObtenerInformacionAlumnoCertificado(){
    this._CertificadoService.ObtenerInformacionAlumnoCertificado(this.idMatriculaCabecera,this.codigoCertificado).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.infoCerti=x
        console.log(x)
        console.log(this.infoCerti)
      },
      complete:()=>{
        this.oncharge=true
      }
    })
  }
}
