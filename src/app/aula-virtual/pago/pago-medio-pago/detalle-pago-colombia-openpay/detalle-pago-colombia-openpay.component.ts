import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-detalle-pago-colombia-openpay',
  templateUrl: './detalle-pago-colombia-openpay.component.html',
  styleUrls: ['./detalle-pago-colombia-openpay.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DetallePagoColombiaOpenpayComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService: HelperService,
    private _router:Router,
    public dialog: MatDialog,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas
  ) { }
  public IdMatriculaCabecera=0
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
  public tipoTarjet=""
  public registroPse:RegistroProcesoPagoPseDTO={
    BancoPSE:'',
    NombreTitularPSE:'',
    NumeroDocumentoPSE:'',
    TelefonoTitularPSE:'',
    TipoClientePSE:'',
    TipoDocumentoPSE:'',
  }
  public DatosFacturacion: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;
  public url = '/AulaVirtual/PagoExitoso/';
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    setTimeout(() => {
      document.documentElement.scrollTop=0;
    }, 1000);
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
    var localDatosFacturacion = this._SessionStorageService.SessionGetValue('DatosFacturacionPagos');
    console.log(localDatosFacturacion)
    if(localDatosFacturacion!=''){
      this.DatosFacturacion = JSON.parse(localDatosFacturacion);
      this.jsonSave.Comprobante = this.DatosFacturacion.Comprobante;
      this.jsonSave.CodigoTributario = this.DatosFacturacion.CodigoTributario;
      this.jsonSave.RazonSocial = this.DatosFacturacion.RazonSocial;
    }
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.jsonSave.TarjetaHabiente.Titular =x.datosAlumno.nombres+' '+x.datosAlumno.apellidos;
      this.jsonSave.TarjetaHabiente.NumeroDocumento =x.datosAlumno.dni;
    });
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultPreProceso=x._Repuesta;

        if(this.resultPreProceso.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisPagos/', this.IdMatriculaCabecera]);
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

        this.jsonSave.PagoPSE=(this.resultPreProceso.idPasarelaPago!=1 || this.resultPreProceso.idFormaPago!=65)?false:true;
      }
    })
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
