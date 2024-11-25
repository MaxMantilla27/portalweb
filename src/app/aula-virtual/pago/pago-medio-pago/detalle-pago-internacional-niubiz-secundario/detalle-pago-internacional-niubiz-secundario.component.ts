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
declare var OpenPay: any;
@Component({
  selector: 'app-detalle-pago-internacional-niubiz-secundario',
  templateUrl: './detalle-pago-internacional-niubiz-secundario.component.html',
  styleUrls: ['./detalle-pago-internacional-niubiz-secundario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoInternacionalNiubizSecundarioComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private _renderer2: Renderer2,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    public dialog: MatDialog,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,

  ) { }
  public IdMatriculaCabecera=0;
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultCard:any
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
  public emailAlumno : string = "";
  public DatosFacturacion: any;
  public IdPasarelaPago=0
  public tarjetas: any;

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    setTimeout(() => {
      document.documentElement.scrollTop=0;
    }, 1000);
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.jsonSave.TarjetaHabiente.Titular =x.datosAlumno.nombres+' '+x.datosAlumno.apellidos;
      this.jsonSave.TarjetaHabiente.NumeroDocumento =x.datosAlumno.dni;
      this.emailAlumno = x.datosAlumno.email;
    })
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.IdMatriculaCabecera = parseInt(x['idmatricula']);
        this.IdPasarelaPago = parseInt(x['idpasarelapago']);
        this.json.IdentificadorTransaccion = x['identificador'];
        const r = this._SessionStorageService.SessionGetValue(
          this.json.IdentificadorTransaccion
        );
        this.json.RequiereDatosTarjeta = r === 'false' ? false : true;
        var localDatosFacturacion = this._SessionStorageService.SessionGetValue('DatosFacturacionPagos');
        console.log(localDatosFacturacion)
        if(localDatosFacturacion!=''){
          this.DatosFacturacion = JSON.parse(localDatosFacturacion);
          console.log(this.DatosFacturacion);

        }
        this.ObtenerPreProcesoPagoCuotaAlumno();
        this.ObtenerTarjetasMedioPago();
      },

    });
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultCard=x._Repuesta;

        if(this.resultCard.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.IdMatriculaCabecera])
        }
        this.resultCard.total=0;
        this.resultCard.listaCuota.forEach((l:any) => {
          this.resultCard.total+=l.cuotaTotal
        });
        this.jsonSave.IdentificadorTransaccion=this.resultCard.identificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultCard.medioCodigo
        this.jsonSave.MedioPago=this.resultCard.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.CodigoTributario=this.resultCard.identificadorTransaccion
        this.jsonSave.RazonSocial=this.resultCard.identificadorTransaccion
        this.jsonSave.IdPasarelaPago=this.resultCard.idPasarelaPago
        this.jsonSave.IdentificadorUsuario=this._SessionStorageService.SessionGetValue('usuarioWeb');

        this.jsonSave.PagoPSE=(this.resultCard.idPasarelaPago!=1 || this.resultCard.idFormaPago!=65)?false:true;
        if (this.resultCard.idPasarelaPago == 5) {
          this.OpenPayInit();
        }
      }
    })
  }
  OpenPayInit() {
    console.log(OpenPay.deviceData);
    //mlfmdoeugmuhd6epubse --prueba
    //mxgmgffnaxu1mosrkhlo
    OpenPay.setId('mxgmgffnaxu1mosrkhlo');
    //pk_81210f4cdefe4888bbe4ccfd8923655a --prueba
    //pk_c9dfff7c5c9e4a68a7c6083d280ff4db
    OpenPay.setApiKey('pk_c9dfff7c5c9e4a68a7c6083d280ff4db');
    //OpenPay.setSandboxMode(false);
    OpenPay.setSandboxMode(false);
    //Se genera el id de dispositivo
    var deviceSessionId = OpenPay.deviceData.setup('fomrOpenPAy');
    console.log(OpenPay.getSandboxMode());
    this.jsonSave.DeviceSessionId = deviceSessionId;
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
    if(this.resultCard.idPasarelaPago!=1 || this.resultCard.idFormaPago!=65){
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
      if (this.jsonSave.IdPasarelaPago == 5) {
        OpenPay.token.create(
          {
            card_number: this.jsonSave.TarjetaHabiente.NumeroTarjeta,
            holder_name: this.jsonSave.TarjetaHabiente.Titular,
            expiration_year: this.jsonSave.TarjetaHabiente.Aniho,
            expiration_month: this.jsonSave.TarjetaHabiente.Mes,
            cvv2: this.jsonSave.TarjetaHabiente.CodigoVV,
          },
          succes,
          error
        );
      } else {
        if(this.oncharge==false){
          this.Pagar();
        }
      }
    }
  }
  Pagar(){
    this.oncharge=true
    const dialogRef =this.dialog.open(ChargeTextComponent,{
      panelClass:'dialog-charge-text',
      data: { text: 'Procesando pago' },
      disableClose:true
    });
    this.registroPse.NombreTitularPSE=this.jsonSave.TarjetaHabiente.Titular;
    this.registroPse.NumeroDocumentoPSE=this.jsonSave.TarjetaHabiente.NumeroDocumento;
    this.jsonSave.RegistroProcesoPagoPse=this.registroPse;
    this._FormaPagoService.ProcesarPagoCuotaAlumno(this.jsonSave).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.oncharge=false
        dialogRef.close()
        console.log(x);
        if(this.resultCard.idPasarelaPago!=1 || this.resultCard.idFormaPago!=65){
          if(this.resultCard.idPasarelaPago!=5){
            this._router.navigate(['/AulaVirtual/PagoExitoso/'+this.jsonSave.IdentificadorTransaccion])
          }else{
            if(x._Repuesta.urlRedireccionar=='' || x._Repuesta.urlRedireccionar==null){
              this._router.navigate(['/AulaVirtual/PagoExitoso/'+this.jsonSave.IdentificadorTransaccion])
            }else{
              location.href=x._Repuesta.urlRedireccionar;
            }
          }
        }else{
          if(x._Repuesta.urlRedireccionar=='' || x._Repuesta.urlRedireccionar==null){
            this._router.navigate(['/AulaVirtual/PagoExitoso/'+this.jsonSave.IdentificadorTransaccion])
          }else{
            location.href=x._Repuesta.urlRedireccionar;
          }
        }
      },
      error:e=>{
        this.oncharge=false
        dialogRef.close()
      },
      complete:()=>{
        this.oncharge=false
        dialogRef.close();
      }
    })
  }
  RegresarPasarela(){
    this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/'+this.IdPasarelaPago]);
  }
  ObtenerTarjetasMedioPago() {
    this._MedioPagoActivoPasarelaService
      .MedioPagoPasarelaPortalCronograma(this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x:any) => {
          this.tarjetas = x;
          this.tarjetas.forEach((e: any) => {
            e.img = this._t.GetTarjeta(e.medioCodigo);
          });
          console.log('Tarjetas por alumno', this.tarjetas);
        },
        complete: () => {
          // this.ObtenerInformacionPagoLocal()
        },
      });
  }
}
