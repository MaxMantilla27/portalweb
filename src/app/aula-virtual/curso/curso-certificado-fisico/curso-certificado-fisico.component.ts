import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combosPerfilDTO } from 'src/app/Core/Models/AlumnoDTO';
import { InsertarRegistroEnvioFisicoDTO } from 'src/app/Core/Models/CertificadoDTO';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-curso-certificado-fisico',
  templateUrl: './curso-certificado-fisico.component.html',
  styleUrls: ['./curso-certificado-fisico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoCertificadoFisicoComponent implements OnInit ,OnChanges{

  constructor(
    private _HelperService: HelperService,
    private _CertificadoService:CertificadoService,
    private _SnackBarServiceService:SnackBarServiceService
  ) { }


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
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {
      console.log(x);
      this.combosPerfil = x;
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
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.datosCertificado!=undefined){
      this.userForm.get('Pais')?.disable();
      if(this.datosCertificado.idSolicitudCertificadoFisico!=null && this.datosCertificado.idSolicitudCertificadoFisico>0){
        this.expacion=[false,false,true]
        this.bloquearTodosInputs();
      }
    }
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
    this._CertificadoService.RegistrarSolicitudCertificadoFisico(this.jsonEnvio).subscribe({
      next:x=>{
        console.log(x)
        if(x.mensaje==''){
          this._SnackBarServiceService.openSnackBar("Se genero la solicitud de su certificado satisfactoriamente",'x',15,"snackbarCrucigramaSucces");
          this.OnGenerate.emit();
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
  }
}
