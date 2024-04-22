
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
declare var OpenPayPeru: any;
declare var OpenPayColombia: any;
declare var OpenPay: any;
@Component({
  selector: 'app-afiliacion-openpay',
  templateUrl: './afiliacion-openpay.component.html',
  styleUrls: ['./afiliacion-openpay.component.scss']
})
export class AfiliacionOpenpayComponent implements OnInit,OnDestroy {

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

  NumberT:any

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public tipoTarjet=""
  public idMatricula=0
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultCard:any
  public oncharge=false
  public dialogRef:any

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
    FechaFinalAfiliacion:'',
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

  public jsonEnvio:any={
    identificadorTransaccion: '',
    idPasarelaPago: 0,
    deviceSessionId: '',
    tokenId: '',
    idAlumno: 0,
    idUsuario: '',
    usuarioModificacion: ''
  }

  public DataComprobante:any=
  {
    idComprobante:'',
    nroDoc:'',
    razonSocial:'',
    listaCuota:''
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
        this.DataComprobante.listaCuota =x._Repuesta.listaCuota;
        if(this.resultCard.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.idMatricula])
        }
        this.resultCard.total=0;
        let count=0
        this.resultCard.listaCuota.forEach((l:any) => {
          if(count==0){
            this.resultCard.total+=l.cuotaTotal
          }
          count++
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
    var deviceSessionId =""
    if(this.jsonSave.IdPasarelaPago==16){
      // OpenPayColombia.setId('mxqbvmmsltqluhbqauyo'); //--PRUEBA
      // OpenPayColombia.setApiKey('pk_ba4c502aa2b848c2a6e67c3a36268542'); //--PRUEBA
      OpenPayColombia.setId('mplrg136vnwpb3badwpv');
      OpenPayColombia.setApiKey('pk_a0440e88efb34c668644d2f52027b251');
      OpenPayColombia.setSandboxMode(false);
      deviceSessionId = OpenPayColombia.deviceData.setup('fomrOpenPAy');
    }
    else if(this.jsonSave.IdPasarelaPago==18){
      // OpenPayPeru.setId('momoj94bmepe1pmubupx'); //--PRUEBA
      // OpenPayPeru.setApiKey('pk_adaaac28202241d6a979341a0d463809'); //--PRUEBA
      //OpenPayPeru.setSandboxMode(false);
      OpenPayPeru.setId('mtdw8qhfdylsh4rotsoh');
      OpenPayPeru.setApiKey('pk_110ab96b532e4cd298a86652327ba258');
      OpenPayPeru.setSandboxMode(false);
      deviceSessionId = OpenPayPeru.deviceData.setup('fomrOpenPAy');
    }
    else{
      OpenPay.setId('mxgmgffnaxu1mosrkhlo');
      OpenPay.setApiKey('pk_c9dfff7c5c9e4a68a7c6083d280ff4db');
      OpenPay.setSandboxMode(false);
      deviceSessionId = OpenPay.deviceData.setup('fomrOpenPAy');
    }
    this.jsonSave.DeviceSessionId = deviceSessionId;
  }

  ValidateSave(){
    var succes=(res:any) =>{
      console.log(res)
      this.jsonSave.TokenId=res.data.id
      this.Afiliar();

    }
    var error=(err:any) =>{
      this.dialogRef.close()
      this._SnackBarServiceService.openSnackBar(
        'Los datos de tarjeta ingresados son incorrectos',
        'x',
        5,
        'snackbarCrucigramaerror'
      );

    }
    var validate=true
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
    if (validate) {
      this.dialogRef =this.dialog.open(ChargeTextComponent,{
        panelClass:'dialog-charge-text',
        data: { text: 'Procesando Afiliación' },
        disableClose:true
      });
      this.jsonSave.TarjetaHabiente.NumeroTarjeta =this.NumberT.split('-').join('');
      this.jsonSave.TarjetaHabiente.Aniho =this.jsonSave.TarjetaHabiente.fecha.split('/')[1];
      this.jsonSave.TarjetaHabiente.Mes =this.jsonSave.TarjetaHabiente.fecha.split('/')[0];

      if(this.jsonSave.IdPasarelaPago==16){
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
        )
      }
      else if(this.jsonSave.IdPasarelaPago==18){
        OpenPayPeru.token.create(
          {
            card_number: this.jsonSave.TarjetaHabiente.NumeroTarjeta,
            holder_name: this.jsonSave.TarjetaHabiente.Titular,
            expiration_year: this.jsonSave.TarjetaHabiente.Aniho,
            expiration_month: this.jsonSave.TarjetaHabiente.Mes,
            cvv2: this.jsonSave.TarjetaHabiente.CodigoVV,
          },
          succes,
          error
        )
      }
      else{
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
        )
      }


    }
  }

  Afiliar(){
    this.DataComprobante.idComprobante=this.jsonSave.Comprobante==false?2:1
    this.DataComprobante.nroDoc = this.jsonSave.Comprobante==false?this.jsonSave.TarjetaHabiente.NumeroDocumento:this.jsonSave.CodigoTributario
    this.DataComprobante.razonSocial = this.jsonSave.RazonSocial
    this._SessionStorageService.SessionSetValue('comprobante',JSON.stringify(this.DataComprobante));

    this.oncharge=true
    this.jsonEnvio.identificadorTransaccion= this.jsonSave.IdentificadorTransaccion
    this.jsonEnvio.idPasarelaPago = this.jsonSave.IdPasarelaPago
    this.jsonEnvio.tokenId = this.jsonSave.TokenId
    this.jsonEnvio.deviceSessionId = this.jsonSave.DeviceSessionId

    console.log(this.jsonEnvio)
    this._FormaPagoService.ProcesarAfiliacionPagoRecurrenteAlumno(this.jsonSave).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.oncharge=false
        this.dialogRef.close()
        window.location.href =x._Repuesta.urlRedireccionar;
      },
      error:e=>{
        this.oncharge=false
        this.dialogRef.close()
      },
      complete:()=>{
        this.oncharge=false
        this.dialogRef.close()
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
