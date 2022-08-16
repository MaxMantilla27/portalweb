import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DatosAlumnoValidacionDTO } from 'src/app/Core/Models/CertificadoDTO';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { CertificadoIntegraService } from 'src/app/Core/Shared/Services/CertificadoIntegra/certificado-integra.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-curso-certificado',
  templateUrl: './curso-certificado.component.html',
  styleUrls: ['./curso-certificado.component.scss']
})
export class CursoCertificadoComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _CertificadoService:CertificadoService,
    private _HelperService:HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _CertificadoIntegraService:CertificadoIntegraService,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() idProyecto:any;
  @Input() idPGeneral=0;;
  @Input() idPEspecifico=0;
  @Input() datosCertificado:any;
  @Input() curso:any;
  @Input() alertaDigital=false;
  @Input() alertaFisico=false;
  @Input() changeOnGenerate=true
  public json:DatosAlumnoValidacionDTO={
    Nombres:'',
    Apellidos:''
  }

  public errorRegister = '';
  statuscharge = false;
  initValues=false;
  formVal: boolean = false;
  fileds: Array<formulario> = [];
  public miPerfil:any
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  public charge=false
  @Output() OnValidation = new EventEmitter<void>();
  @Output() OnGenerate = new EventEmitter<void>();
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x:any) => {
      this.json.Nombres=x.datosAlumno.nombres
      this.json.Apellidos=x.datosAlumno.apellidos

      console.log(this.json)
      this.miPerfil=x
      console.log(this.miPerfil)
      if(this.fileds.length==0){
        this.AddField()
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!this.changeOnGenerate && this.charge){
      this.charge=false
      this.changeOnGenerate=true
      console.log(this.datosCertificado)
      if(this.datosCertificado.nombreArchivo==null || this.datosCertificado.nombreArchivo==''){
        this._SnackBarServiceService.openSnackBar("Ocurrió un error, comunícate con tu asesor",'x',10,"snackbarCrucigramaerror");
      }else{
        this._SnackBarServiceService.openSnackBar("Se genero su certificado exitosamente",'x',15,"snackbarCrucigramaSucces");
        window.open('https://repositorioweb.blob.core.windows.net/operaciones/comprobantes/'+this.datosCertificado.nombreArchivo, "_blank");
      }
    }
  }
  InsertarValidacionDatosAlumno(e:any){
    console.log(e)
    this.json.Nombres=e.Nombres
    this.json.Apellidos=e.Apellidos
    this._CertificadoService.InsertarValidacionDatosAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.DatoObservable.datoContenido=true
        this._SnackBarServiceService.openSnackBar("Se validaron sus datos con exito",'x',10,"snackbarCrucigramaSucces");
        this._HelperService.enviarDatoCuenta(this.DatoObservable)
        this.OnValidation.emit()
      },
      error:x=>{

        this._SnackBarServiceService.openSnackBar("Ocurrió un error, comunícate con tu asesor",'x',10,"snackbarCrucigramaerror");
      }
    })
  }

  AddField() {

    console.log(this.miPerfil.datosAlumno.nombres)
    this.fileds.push({
      nombre: 'Nombres',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Nombres',
    });
    this.fileds.push({
      nombre: 'Apellidos',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Apellidos',
    });
  }
  GenerarCertificadoPorAlumnoIdMatriculaCabecera(){
    console.log(1)
    this.charge=true
    this._CertificadoIntegraService.GenerarCertificadoPorAlumnoIdMatriculaCabecera(this.datosCertificado.idMatriculaCabecera)
    .pipe(takeUntil(this.signal$))
    .subscribe({
      next:x=>{
        console.log(x)
        this.OnGenerate.emit()
      },
      error:x=>{
        console.log(x)
        this.charge=false
        this._SnackBarServiceService.openSnackBar("Ocurrió un error, comunícate con tu asesor",'x',10,"snackbarCrucigramaerror");
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

        this.OnGenerate.emit()
      },
      error:x=>{
        console.log(x)
        this.charge=false
        this._SnackBarServiceService.openSnackBar("Ocurrió un error, comunícate con tu asesor",'x',10,"snackbarCrucigramaerror");
      }
    })
  }
}
