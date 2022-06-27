import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

declare var OpenPay: any;
@Component({
  selector: 'app-confirmacion-pago-tarjeta',
  templateUrl: './confirmacion-pago-tarjeta.component.html',
  styleUrls: ['./confirmacion-pago-tarjeta.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmacionPagoTarjetaComponent implements OnInit {

  private signal$ = new Subject();
  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router
  ) { }

  public idMatricula=0
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultCard:any

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
        if (this.resultCard.idPasarelaPago == 5) {
          this.OpenPayInit();
        }
      }
    })
  }
  OpenPayInit() {
    console.log(OpenPay.deviceData);

    OpenPay.setId('mxgmgffnaxu1mosrkhlo');
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
    if(this.jsonSave.TarjetaHabiente.fecha.length<5){
      validate=false;
      this._SnackBarServiceService.openSnackBar("Fecha de vencimiento incorrecta",'x',5,"snackbarCrucigramaerror");
    }
    if(this.jsonSave.TarjetaHabiente.CodigoVV.length<3){
      validate=false;
      this._SnackBarServiceService.openSnackBar("Numero CVV Incorrecto",'x',5,"snackbarCrucigramaerror");
    }
    if(!this.NumberT.startsWith('34') && this.NumberT.length<19){
      validate=false;
      this._SnackBarServiceService.openSnackBar("Numero de tarjeta Incorrecta",'x',5,"snackbarCrucigramaerror");
    }
    if(this.NumberT.startsWith('34') && this.NumberT.length<17){
      validate=false;
      this._SnackBarServiceService.openSnackBar("Numero de tarjeta Incorrecta",'x',5,"snackbarCrucigramaerror");
    }
    console.log(validate)
    if(validate){

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
        this.Pagar();
      }
    }
  }
  Pagar(){
    this.jsonSave.TarjetaHabiente.NumeroTarjeta=this.NumberT.split('-').join('');
    this.jsonSave.TarjetaHabiente.Aniho=this.jsonSave.TarjetaHabiente.fecha.split('/')[1];
    this.jsonSave.TarjetaHabiente.Mes=this.jsonSave.TarjetaHabiente.fecha.split('/')[0];
    this._FormaPagoService.ProcesarPagoCuotaAlumno(this.jsonSave).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this._router.navigate(['/AulaVirtual/PagoExitoso/'+this.jsonSave.IdentificadorTransaccion])
      }
    })
  }
}
