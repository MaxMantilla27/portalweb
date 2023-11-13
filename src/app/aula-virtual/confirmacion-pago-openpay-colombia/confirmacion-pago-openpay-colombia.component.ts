import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroProcesoPagoPseDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
declare var OpenPayColombia: any;

@Component({
  selector: 'app-confirmacion-pago-openpay-colombia',
  templateUrl: './confirmacion-pago-openpay-colombia.component.html',
  styleUrls: ['./confirmacion-pago-openpay-colombia.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmacionPagoOpenpayColombiaComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();
  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    public dialog: MatDialog,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public idMatricula=0
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
  public tipoTarjet=""
  public registroPse:RegistroProcesoPagoPseDTO={
    BancoPSE:'',
    NombreTitularPSE:'',
    NumeroDocumentoPSE:'',
    TelefonoTitularPSE:'',
    TipoClientePSE:'',
    TipoDocumentoPSE:'',
  }
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.jsonSave.TarjetaHabiente.Titular =x.datosAlumno.nombres+' '+x.datosAlumno.apellidos;
      this.jsonSave.TarjetaHabiente.NumeroDocumento =x.datosAlumno.dni;
    })
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.json.IdentificadorTransaccion = x['Identificador'];
        var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
        if(r!=''){
          this.json.RequiereDatosTarjeta=r=='false'?false:true;
          //this._SessionStorageService.SessionDeleteValue(this.json.IdentificadorTransaccion);
        }
        this.ObtenerPreProcesoPagoCuotaAlumno()
      },
    });
  }

  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultCard=x._Repuesta;

        if(this.resultCard.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.idMatricula])
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
        this.OpenPayInit();
      }
    })
  }
  OpenPayInit() {
    OpenPayColombia.setId('mxqbvmmsltqluhbqauyo');
    OpenPayColombia.setApiKey('pk_ba4c502aa2b848c2a6e67c3a36268542');
    OpenPayColombia.setSandboxMode(true);
    var deviceSessionId = OpenPayColombia.deviceData.setup('fomrOpenPAy');
    console.log(OpenPayColombia.getSandboxMode());
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
      OpenPayColombia.token.create(
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
        if(x._Repuesta.urlRedireccionar=='' || x._Repuesta.urlRedireccionar==null){
          this._router.navigate(['/AulaVirtual/PagoExitoso/'+this.jsonSave.IdentificadorTransaccion])
        }else{
          location.href=x._Repuesta.urlRedireccionar;
        }
        
      },
      error:e=>{
        this.oncharge=false
        dialogRef.close()
      },
      complete:()=>{
        this.oncharge=false
        dialogRef.close()
      }
    })
  }

  obtenerTipoTarjeta(){
    var numeroTarjetaLimpio = this.NumberT.replace(/\s/g, '').replace(/[^0-9]/gi, '');

    const patronesTarjetas: Record<string, RegExp> = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      carnet :/^506[0-9]/
    };
    let tarjeta=""
    for (const tipo in patronesTarjetas) {
      if (patronesTarjetas[tipo].test(numeroTarjetaLimpio)) {
        tarjeta = tipo;
          break;
      }
      else tarjeta =""
    }

    switch(tarjeta){
      case 'visa':this.tipoTarjet='visa-07.svg';break;
      case 'mastercard':this.tipoTarjet='mastercard-08.svg';break;
      case 'amex':this.tipoTarjet='american-09.svg';break;
      case 'carnet':this.tipoTarjet='carnet-mexico.svg';break;
      default :this.tipoTarjet=""
    }
  }
}