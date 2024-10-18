import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroProcesoPagoPseDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalle-pago-colombia-payu',
  templateUrl: './detalle-pago-colombia-payu.component.html',
  styleUrls: ['./detalle-pago-colombia-payu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoColombiaPayuComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private _renderer2: Renderer2,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,
  ) { }
  public idMatricula=0;
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultPreProceso:any
  public oncharge=false
  public jsonSave:RegistroProcesoPagoAlumnoDTO={
    IdentificadorTransaccion:'',
    MedioCodigo:'',
    MedioPago:'',
    RequiereDatosTarjeta:true,
    TransactionToken:'',
    Estado:null,
    Comprobante:false,
    CodigoTributario:'',
    RazonSocial:'',
    IdPasarelaPago:0,
    IdentificadorUsuario:'',
    PagoPSE:false,
    TarjetaHabiente:{
      Aniho:'',
      CodigoVV:'',
      Mes:'',
      NumeroDocumento:'',
      NumeroTarjeta:'',
      Titular:'',
      fecha:'',
    },
  }
  public NumberT=''
  public registroPse:RegistroProcesoPagoPseDTO={
    BancoPSE:'',
    NombreTitularPSE:'',
    NumeroDocumentoPSE:'',
    TelefonoTitularPSE:'',
    TipoClientePSE:'',
    TipoDocumentoPSE:'',
  }
  public IdMatriculaCabecera=0;
  public DatosFacturacion: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;
  public url = '/AulaVirtual/PagoExitoso/';
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.jsonSave.TarjetaHabiente.Titular =x.datosAlumno.nombres+' '+x.datosAlumno.apellidos;
      this.jsonSave.TarjetaHabiente.NumeroDocumento =x.datosAlumno.dni;
    })
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (params) => {
        this.IdMatriculaCabecera = +params['idmatricula'];
        this.IdPasarelaPago = +params['idpasarelapago'];
        this.json.IdentificadorTransaccion = params['identificador'];
        this.json.RequiereDatosTarjeta =
          this._SessionStorageService.SessionGetValue(
            this.json.IdentificadorTransaccion
          ) !== 'false';

        this.url += this.json.IdentificadorTransaccion;
        this.ObtenerPreProcesoPagoCuotaAlumno();
        this.ObtenerTarjetasMedioPago();
      },
    });

  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultPreProceso=x._Repuesta;

        if(this.resultPreProceso.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.idMatricula])
        }
        this.resultPreProceso.total=0;
        this.resultPreProceso.listaCuota.forEach((l:any) => {
          this.resultPreProceso.total+=l.cuotaTotal
        });
        this.jsonSave.IdentificadorTransaccion=this.resultPreProceso.identificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultPreProceso.medioCodigo
        this.jsonSave.MedioPago=this.resultPreProceso.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.CodigoTributario=this.resultPreProceso.identificadorTransaccion
        this.jsonSave.RazonSocial=this.resultPreProceso.identificadorTransaccion
        this.jsonSave.IdPasarelaPago=this.resultPreProceso.idPasarelaPago
        this.jsonSave.IdentificadorUsuario=this._SessionStorageService.SessionGetValue('usuarioWeb');
        this.jsonSave.PagoPSE=(this.resultPreProceso.idFormaPago==64)?false:true;

      }
    })
  }

  ValidateSave(){
    var succes=(res:any) =>{
      console.log(res)
      this.jsonSave.TokenId=res.data.id
      this.Pagar();

    }
    var error=(err:any) =>{
      console.log(err);

      this._SnackBarServiceService.openSnackBar(
        'Los datos de tarjeta ingresados son incorrectos',
        'x',
        5,
        'snackbarCrucigramaerror'
      );

    }
    var validate=true
    if(this.resultPreProceso.idFormaPago!=65){
      if (this.jsonSave.TarjetaHabiente.fecha.length < 5) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Fecha de vencimiento incorrecta',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if (this.jsonSave.TarjetaHabiente.CodigoVV.length < 3) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Numero CVV Incorrecto',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if (!this.NumberT.startsWith('37') && this.NumberT.split('-').join('').length < 14) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Numero de tarjeta Incorrecta',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if (this.NumberT.startsWith('34') && this.NumberT.split('-').join('').length < 14) {
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Numero de tarjeta Incorrecta',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
    }else{
      if(this.registroPse.TipoDocumentoPSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Ingrese su tipo de documento',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if(this.registroPse.TipoClientePSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Ingrese el tipo de cliente',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if(this.registroPse.TelefonoTitularPSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Ingrese su numero celular',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
      if(this.registroPse.BancoPSE==''){
        validate = false;
        this._SnackBarServiceService.openSnackBar(
          'Seleccione su banco',
          'x',
          5,
          'snackbarCrucigramaerror'
        );
      }
    }
    if(this.jsonSave.TarjetaHabiente.Titular==''){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese los nombres del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
    console.log(this.jsonSave.TarjetaHabiente.NumeroDocumento.length)
    if(this.jsonSave.TarjetaHabiente.NumeroDocumento==null || this.jsonSave.TarjetaHabiente.NumeroDocumento.length<=5){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese el documento completo del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
    console.log(validate);
    if (validate) {

      this.jsonSave.TarjetaHabiente.NumeroTarjeta =this.NumberT.split('-').join('');
      this.jsonSave.TarjetaHabiente.Aniho =this.jsonSave.TarjetaHabiente.fecha.split('/')[1];
      this.jsonSave.TarjetaHabiente.Mes =this.jsonSave.TarjetaHabiente.fecha.split('/')[0];
      if(this.oncharge==false){
        this.Pagar();
      }
    }
  }
  Pagar(){
    this.oncharge=true
    this.registroPse.NombreTitularPSE=this.jsonSave.TarjetaHabiente.Titular;
    this.registroPse.NumeroDocumentoPSE=this.jsonSave.TarjetaHabiente.NumeroDocumento;
    this.jsonSave.RegistroProcesoPagoPse=this.registroPse;
    this._FormaPagoService.ProcesarPagoCuotaAlumno(this.jsonSave).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        if(this.resultPreProceso.idFormaPago!=65){
          this._router.navigate(['/AulaVirtual/PagoExitoso/'+this.jsonSave.IdentificadorTransaccion])
        }else{
          if(x._Repuesta.urlRedireccionar=='' || x._Repuesta.urlRedireccionar==null){
            this._router.navigate(['/AulaVirtual/PagoExitosoPse/'+this.jsonSave.IdentificadorTransaccion])
          }else{
            location.href=x._Repuesta.urlRedireccionar;
          }
        }
      },
      error:e=>{
        this.oncharge=false
      },
      complete:()=>{
        this.oncharge=false
      }
    })
  }
  ObtenerTarjetasMedioPago(): void {
    this._MedioPagoActivoPasarelaService
      .MedioPagoPasarelaPortalCronograma(this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (response) => {
          this.tarjetas = response.map((tarjeta: any) => ({
            ...tarjeta,
            img: this._t.GetTarjeta(tarjeta.medioCodigo),
          }));
          console.log('Tarjetas por alumno', this.tarjetas);
        },
      });
  }
  RegresarPasarela(): void {
    this._router.navigate(['/AulaVirtual/MisPagos/', this.IdMatriculaCabecera]);
  }
}
