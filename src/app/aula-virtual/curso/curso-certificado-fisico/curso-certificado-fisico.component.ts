import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { combosPerfilDTO } from 'src/app/Core/Models/AlumnoDTO';
import { InsertarRegistroEnvioFisicoDTO } from 'src/app/Core/Models/CertificadoDTO';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { ConfirmCertFisicoComponent } from './confirm-cert-fisico/confirm-cert-fisico.component';

@Component({
  selector: 'app-curso-certificado-fisico',
  templateUrl: './curso-certificado-fisico.component.html',
  styleUrls: ['./curso-certificado-fisico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoCertificadoFisicoComponent implements OnInit,OnDestroy ,OnChanges{

  private signal$ = new Subject();
  constructor(
    private _HelperService: HelperService,
    private _CertificadoService:CertificadoService,
    private _SnackBarServiceService:SnackBarServiceService,
    public dialog: MatDialog,


  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() datosCertificado:any;
  @Input() curso:any;
  @Input() changeOnGenerate=true
  @Input() idPEspecifico=0
  @Input() idPGeneral=0
  @Input() idMatricula=0
  @Input() CodigoMatricula=''
  @Output() OnGenerate = new EventEmitter<void>();
  public close=false
  public expacion=[true,false,false]
  formEnvio = false;
  buttonEnviar= true;
  public combosPerfil: combosPerfilDTO = {
    listaAreaFormacion:[],
    listaAreaTrabajo:[],
    listaCargo:[],
    listaCiudad:[],
    listaGenero:[],
    listaIndustria:[],
    listaPais:[],
    listaTipoDocumento:[],
    datosAlumno: {
      apellidos: '',
      direccion: '',
      dni: '',
      email: '',
      empresa: '',
      idAlumno: 0,
      idAreaFormacion: 0,
      idAreaTrabajo: 0,
      idCargo: 0,
      idDepartamento: 0,
      ciudad:'',
      idGenero: 0,
      idIndustria: 0,
      idPais: 0,
      idTipoDocumento: '',
      nombres: '',
      telefono: '',
      cursos:0,
      idProveedor:0
    },

  };
  public disableDatos=true;
  public userForm :FormGroup=new FormGroup({
    Pais: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Direccion: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Ciudad: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),

    Nombres: new FormControl({value:this.combosPerfil.datosAlumno.nombres, disabled: this.disableDatos},Validators.required),
    Apellido: new FormControl({value:this.combosPerfil.datosAlumno.apellidos, disabled: this.disableDatos},Validators.required),
    TipoDocumento: new FormControl({value:this.combosPerfil.datosAlumno.idTipoDocumento, disabled: this.disableDatos},Validators.required),
    Documento: new FormControl({value:this.combosPerfil.datosAlumno.dni, disabled: this.disableDatos},Validators.required),
    Movil: new FormControl({value:this.combosPerfil.datosAlumno.telefono, disabled: this.disableDatos},Validators.required),


    Distrito: new FormControl('',Validators.required),
    Codigo: new FormControl('',Validators.required),
    Referencia: new FormControl('',Validators.required),
    Region: new FormControl('',Validators.required),
    RecepcionPersonal: new FormControl(true),
    Terminos: new FormControl(false,Validators.requiredTrue),

  })
  public jsonEnvio:InsertarRegistroEnvioFisicoDTO={
    Apellido:'',
    Ciudad:'',
    CodigoMatricula:'',
    CodigoPostal:'',
    DNI:'',
    Direccion:'',
    Distrito:'',
    Id:0,
    IdAlumno:0,
    IdAspNetUsers:'',
    IdMatriculaCabecera:0,
    IdPEspecifico:0,
    IdPGeneral:0,
    Mensaje:'',
    Nombre:'',
    Referencia:'',
    Region:'',
    Telefono:'',
    Usuario:'',
    IdCertificadoGeneradoAutomatico:0,
    IdSolicitudCertificadoFisico:0
  }
  public IdEstadoCertificadoFisico=0;
  ngOnInit(): void {
    console.log(this.datosCertificado)
    if(this.datosCertificado.idSolicitudCertificadoFisico!=null){
      this.IdEstadoCertificadoFisico=this.datosCertificado.datosCourierEnvio.idEstadoCertificadoFisico
    }
    if(this.datosCertificado!=undefined){
      this.userForm.get('Pais')?.disable();
      console.log(this.datosCertificado.idSolicitudCertificadoFisico)
      console.log(this.IdEstadoCertificadoFisico)
      if(this.IdEstadoCertificadoFisico!=0 &&
         this.IdEstadoCertificadoFisico!=5 &&
         this.IdEstadoCertificadoFisico!=9){
        this.expacion=[false,false,true]
        this.bloquearTodosInputs();
      }
    }
    this.CompletarDatosAlumno();
    // if(this.IdEstadoCertificadoFisico!=0){
    //   this.userForm.patchValue({
    //     Distrito:this.datosCertificado.solicitudCertificadoEnvioDatos.distrito,
    //     CodigoPostal:this.datosCertificado.solicitudCertificadoEnvioDatos.codigoPostal,
    //     Referencia:this.datosCertificado.solicitudCertificadoEnvioDatos.referencia,
    //     Region:this.datosCertificado.solicitudCertificadoEnvioDatos.region,
    // });
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.datosCertificado)

    if(this.datosCertificado!=undefined){
      this.userForm.get('Pais')?.disable();
      console.log(this.datosCertificado.idSolicitudCertificadoFisico)
      if(this.datosCertificado.idSolicitudCertificadoFisico!=null){
        this.IdEstadoCertificadoFisico=this.datosCertificado.datosCourierEnvio.idEstadoCertificadoFisico
      }
      console.log(this.IdEstadoCertificadoFisico)
      if(this.IdEstadoCertificadoFisico!=0 &&
         this.IdEstadoCertificadoFisico!=5 &&
         this.IdEstadoCertificadoFisico!=9){
        this.expacion=[false,false,true]
        this.bloquearTodosInputs();
      }
      // if(this.IdEstadoCertificadoFisico!=0){
      //   this.userForm.patchValue({
      //     Distrito:this.datosCertificado.solicitudCertificadoEnvioDatos!.distrito,
      //     CodigoPostal:this.datosCertificado.solicitudCertificadoEnvioDatos!.codigoPostal,
      //     Referencia:this.datosCertificado.solicitudCertificadoEnvioDatos!.referencia,
      //     Region:this.datosCertificado.solicitudCertificadoEnvioDatos!.region,
      // });
      // }
    }
  }
  CompletarDatosAlumno(){
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      console.log(x);
      console.log(this.datosCertificado.solicitudCertificadoEnvioDatos)
      console.log(this.IdEstadoCertificadoFisico)
      this.combosPerfil = x;
      if(this.IdEstadoCertificadoFisico!=0){
        this.userForm.patchValue({
          Nombres: this.combosPerfil.datosAlumno.nombres,
          Apellido: this.combosPerfil.datosAlumno.apellidos,
          TipoDocumento: this.combosPerfil.datosAlumno.idTipoDocumento,
          Documento: this.combosPerfil.datosAlumno.dni,
          Movil: this.combosPerfil.datosAlumno.telefono,
          Pais: this.combosPerfil.datosAlumno.idPais,
          Ciudad: this.combosPerfil.datosAlumno.ciudad,
          Direccion: this.combosPerfil.datosAlumno.direccion,
          Terminos: false,
          Distrito: this.datosCertificado.solicitudCertificadoEnviadoDatos.distrito,
          Codigo: this.datosCertificado.solicitudCertificadoEnviadoDatos.codigoPostal,
          Referencia: this.datosCertificado.solicitudCertificadoEnviadoDatos.referencia,
          Region: this.datosCertificado.solicitudCertificadoEnviadoDatos.region,
        });
      }
      else{
        this.userForm.patchValue({
          Nombres: this.combosPerfil.datosAlumno.nombres,
          Apellido: this.combosPerfil.datosAlumno.apellidos,
          TipoDocumento: this.combosPerfil.datosAlumno.idTipoDocumento,
          Documento: this.combosPerfil.datosAlumno.dni,
          Movil: this.combosPerfil.datosAlumno.telefono,
          Pais: this.combosPerfil.datosAlumno.idPais,
          Ciudad: this.combosPerfil.datosAlumno.ciudad,
          Direccion: this.combosPerfil.datosAlumno.direccion,
          Terminos: false
        });
      }

    });
  }
  showData() {
    return (this.formEnvio = true, this.buttonEnviar = false);
  }

  openDialog() {
    this.dialog.open(ConfirmCertFisicoComponent);
  }

  GenerarSolicitudCertificadoFisico(){
    this.jsonEnvio.Apellido=this.userForm.get('Apellido')?.value;
    this.jsonEnvio.Nombre=this.userForm.get('Nombres')?.value;
    this.jsonEnvio.DNI=this.userForm.get('Documento')?.value;
    this.jsonEnvio.Telefono=this.userForm.get('Movil')?.value;
    this.jsonEnvio.Ciudad=this.userForm.get('Ciudad')?.value;
    this.jsonEnvio.Direccion=this.userForm.get('Direccion')?.value;
    this.jsonEnvio.Distrito=this.userForm.get('Distrito')?.value;
    this.jsonEnvio.CodigoPostal=this.userForm.get('Codigo')?.value;
    this.jsonEnvio.Referencia=this.userForm.get('Referencia')?.value;
    this.jsonEnvio.Region=this.userForm.get('Region')?.value;
    this.jsonEnvio.IdPEspecifico=this.idPEspecifico;
    this.jsonEnvio.IdPGeneral=this.idPGeneral;
    this.jsonEnvio.IdMatriculaCabecera=this.idMatricula;
    this.jsonEnvio.CodigoMatricula=this.CodigoMatricula
    console.log(this.jsonEnvio)
    this._CertificadoService.RegistrarSolicitudCertificadoFisico(this.jsonEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.mensaje==''){
          this.openDialog();
          this.CerrarDesplegable();
          this.bloquearTodosInputs();
          // this._SnackBarServiceService.openSnackBar("Se generó la solicitud de su certificado satisfactoriamente",'x',15,"snackbarCrucigramaSucces");
          // this.OnGenerate.emit();
        }else{
          this._SnackBarServiceService.openSnackBar(x.mensaje,'x',15,"snackbarCrucigramaerror");
        }

      }
    })
  }
  HabilitarInputs(){
    if(this.disableDatos==true){
      this.userForm.get('Nombres')?.enable();
      this.userForm.get('Apellido')?.enable();
      this.userForm.get('TipoDocumento')?.enable();
      this.userForm.get('Documento')?.enable();
      this.userForm.get('Movil')?.enable();
    }else{
      this.userForm.get('Nombres')?.disable();
      this.userForm.get('Apellido')?.disable();
      this.userForm.get('TipoDocumento')?.disable();
      this.userForm.get('Documento')?.disable();
      this.userForm.get('Movil')?.disable();
    }
    this.disableDatos=!this.disableDatos
  }
  bloquearTodosInputs(){
    this.userForm.get('Nombres')?.disable();
    this.userForm.get('Apellido')?.disable();
    this.userForm.get('TipoDocumento')?.disable();
    this.userForm.get('Documento')?.disable();
    this.userForm.get('Movil')?.disable();
    this.userForm.get('Pais')?.disable();
    this.userForm.get('Ciudad')?.disable();
    this.userForm.get('Direccion')?.disable();
    this.userForm.get('Terminos')?.disable();
    this.userForm.get('Distrito')?.disable();
    this.userForm.get('Codigo')?.disable();
    this.userForm.get('Referencia')?.disable();
    this.userForm.get('Region')?.disable();
    this.userForm.get('RecepcionPersonal')?.disable();

  }
  CerrarDesplegable(){
    this.buttonEnviar=true;
    this.formEnvio=false;
    this.expacion[0]=false;
    this.expacion[1]=false;
    this.expacion[2]=false;
    this.userForm.reset();
    this.CompletarDatosAlumno()
    this.disableDatos=true;
    this.userForm.patchValue({RecepcionPersonal:true});
    this.userForm.get('Nombres')?.disable();
    this.userForm.get('Apellido')?.disable();
    this.userForm.get('TipoDocumento')?.disable();
    this.userForm.get('Documento')?.disable();
    this.userForm.get('Movil')?.disable();
  }
}



