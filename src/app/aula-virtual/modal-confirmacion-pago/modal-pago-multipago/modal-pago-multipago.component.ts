import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
@Component({
  selector: 'app-modal-pago-multipago',
  templateUrl: './modal-pago-multipago.component.html',
  styleUrls: ['./modal-pago-multipago.component.scss']
})
export class ModalPagoMultipagoComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any,

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
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.jsonSave.TarjetaHabiente.Titular =x.datosAlumno.nombres+' '+x.datosAlumno.apellidos;
      this.jsonSave.TarjetaHabiente.NumeroDocumento =x.datosAlumno.dni;
    });
    if(this.data.Identificador){
      this.idMatricula = this.data.IdMatricula
      this.json.IdentificadorTransaccion = this.data.Identificador
      var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
      if(r!=''){
        this.json.RequiereDatosTarjeta=r=='false'?false:true;
      }
      this.ObtenerPreProcesoPagoCuotaAlumno()
    }
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
          this.resultCard = x._Repuesta;
          this.resultCard.total = 0;
          this.jsonSave.IdentificadorTransaccion =
            this.resultCard.identificadorTransaccion;
          this.jsonSave.MedioCodigo = this.resultCard.medioCodigo;
          this.jsonSave.MedioPago = this.resultCard.medioPago;
          this.jsonSave.RequiereDatosTarjeta = this.json.RequiereDatosTarjeta;
          this.jsonSave.CodigoTributario =
            this.resultCard.identificadorTransaccion;
          this.jsonSave.RazonSocial = this.resultCard.identificadorTransaccion;
          this.jsonSave.IdPasarelaPago = this.resultCard.idPasarelaPago;
          this.jsonSave.IdentificadorUsuario=this._SessionStorageService.SessionGetValue('usuarioWeb');
      }
    })
  }
}
