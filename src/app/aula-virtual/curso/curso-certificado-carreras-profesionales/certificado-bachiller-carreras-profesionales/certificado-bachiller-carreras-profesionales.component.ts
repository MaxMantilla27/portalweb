import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { combosPerfilDTO } from 'src/app/Core/Models/AlumnoDTO';
import { InsertarRegistroEnvioFisicoDTO } from 'src/app/Core/Models/CertificadoDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ModalCertificadoBachillerCarrerasProfesionalesComponent } from './modal-certificado-bachiller-carreras-profesionales/modal-certificado-bachiller-carreras-profesionales.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-certificado-bachiller-carreras-profesionales',
  templateUrl: './certificado-bachiller-carreras-profesionales.component.html',
  styleUrls: ['./certificado-bachiller-carreras-profesionales.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CertificadoBachillerCarrerasProfesionalesComponent implements OnInit,OnDestroy ,OnChanges {
  private signal$ = new Subject();
  constructor(
    private _HelperService: HelperService,
    public dialog: MatDialog,


  ){}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Output() VolverCertificadoCarreras: EventEmitter<void> = new EventEmitter<void>();
  public datosCertificado:any;
  public expancionPrincipal=[false,false]
  public IdEstadoCertificadoFisico=0;
  public expancionSecundaria=[true,false,false]
  public close=false
  formEnvio = true;
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
  ngOnInit(): void {
    this.CompletarDatosAlumno();
  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  CompletarDatosAlumno(){
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      console.log(x);
      // console.log(this.datosCertificado.solicitudCertificadoEnvioDatos)
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
          // Distrito: this.datosCertificado.solicitudCertificadoEnviadoDatos.distrito,
          // Codigo: this.datosCertificado.solicitudCertificadoEnviadoDatos.codigoPostal,
          // Referencia: this.datosCertificado.solicitudCertificadoEnviadoDatos.referencia,
          // Region: this.datosCertificado.solicitudCertificadoEnviadoDatos.region,
        });
      }
      // else{
      //   this.userForm.patchValue({
      //     Nombres: 'José Antonio',
      //     Apellido: 'Salas',
      //     TipoDocumento: 1,
      //     Documento: this.combosPerfil.datosAlumno.dni,
      //     Movil: this.combosPerfil.datosAlumno.telefono,
      //     Pais: this.combosPerfil.datosAlumno.idPais,
      //     Ciudad: this.combosPerfil.datosAlumno.ciudad,
      //     Direccion: this.combosPerfil.datosAlumno.direccion,
      //     Terminos: false
      //   });
      // }
      else{
        this.userForm.patchValue({
          Nombres: this.combosPerfil.datosAlumno.nombres,
          Apellido: this.combosPerfil.datosAlumno.apellidos,
          TipoDocumento: this.combosPerfil.datosAlumno.idTipoDocumento,
          Documento: this.combosPerfil.datosAlumno.dni,
          Movil: this.combosPerfil.datosAlumno.telefono,
          Pais: this.combosPerfil.datosAlumno.idPais,
          Ciudad: 'Arequipa',
          Direccion: 'Los Geranios N° 12734',
          Terminos: false,
          Distrito: 'Camana',
          Codigo: '04450',
          Referencia: 'A Espaldas del Hotel de Turistas de Camaná',
          Region: 'Arequipa',
        });
      }

    });
  }
  GenerarSolicitudCertificadoFisico(){

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
    this.formEnvio=true;
    this.expancionPrincipal[1]=false;
    this.expancionSecundaria[0]=false;
    this.expancionSecundaria[1]=false;
    this.expancionSecundaria[2]=false;
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
  Volver(){
    this.VolverCertificadoCarreras.emit();
  }
  RegistrarCertificadoFisico(data:any){
    const dialogRef = this.dialog.open(ModalCertificadoBachillerCarrerasProfesionalesComponent, {
      width: '500px',
      data: data,
      panelClass: 'modal-certificado-estudios-carreras-profesionales-container',
      disableClose:true
    });
    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){

      }
    });
  }


}
