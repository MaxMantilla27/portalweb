import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';


const PK_Produccion ="APP_USR-655cbc43-a08f-482f-a7bc-df64d486c667";
const PK_Prueba ="TEST-4afbabcc-eedf-4dfb-b8ce-9703a5b7f973";
@Component({
  selector: 'app-detalle-pago-chile-mercadopago',
  templateUrl: './detalle-pago-chile-mercadopago.component.html',
  styleUrls: ['./detalle-pago-chile-mercadopago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoChileMercadopagoComponent implements OnInit {
  private signal$ = new Subject()

  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _SessionStorageService:SessionStorageService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,


  ) { }

  idMatricula:any
  resultPreProceso:any;
  hiden=true
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public IdMatriculaCabecera=0;
  public DatosFacturacion: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;
  public url = '/AulaVirtual/PagoExitoso/';
  public urlApi = environment.url_api;
  public urlPortal = environment.url_portal;
  public urlProcesoPago = environment.url_portalv3;
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
        this.iniciarJSMercadoPago()
      },
    });
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultPreProceso=x._Repuesta;
        this.resultPreProceso.total=0;
        this.resultPreProceso.listaCuota.forEach((l:any) => {
          this.resultPreProceso.total+=l.cuotaTotal
        });
        setTimeout(()=>{
          this.renderCardPaymentBrick(window)
        },1000)
      }
    })
  }
  async iniciarJSMercadoPago(){
    await loadMercadoPago();
  }
  async renderCardPaymentBrick(window:any): Promise<void> {
    const mp = new window.MercadoPago(PK_Produccion, {
      locale: "es-PE",
    });
    const bricksBuilder = mp.bricks();
    const settings = {
      initialization: {
        amount: this.resultPreProceso.total, // Monto a ser pagado
        payer: {
          email: this.resultPreProceso.registroAlumno.correo,
        },
      },
      customization: {
        visual: {
          style: {
            theme: 'default', // | 'dark' | 'bootstrap' | 'flat'
          },
          texts: {
            cardholderName: {
              placeholder: "Titular de la Tarjeta"
            },
          },

        },
        paymentMethods: {
          maxInstallments: 1,
        },
      },
      callbacks: {
        onReady: () => {
          setTimeout(() => {

            const divContenedorBTN = document.getElementsByClassName('button-container-gZzvB_');
            if(typeof(divContenedorBTN) != 'undefined' && divContenedorBTN != null && divContenedorBTN.length>0)
            divContenedorBTN[0].setAttribute("style",
            "display:flex;justify-content:center;max-width:100%"
            );

            const btn = document.getElementsByClassName('svelte-1a8kh4a');
            if(typeof(btn) != 'undefined' && btn != null && btn.length>0)
            btn[0].setAttribute("style",
            "max-width: fit-content;"
            );

            this.hiden=false
          }, 500);

        },
        onSubmit: (cardFormData: any) => {
          // Callback llamado al hacer clic en el botón de envío de datos
          cardFormData.identificadorTransaccion = this.json.IdentificadorTransaccion
          cardFormData.description = this.resultPreProceso.nombrePrograma
          console.log(cardFormData)
          return new Promise<void>((resolve, reject) => {
            console.log(cardFormData)
            fetch(this.urlApi+ 'FormaPago/ProcesarPagoCuotaAlumnoConfirmarMercadoPago', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(cardFormData),
            })
              .then(() => {
                window.location.href = this.urlPortal+'AulaVirtual/PagoExitosoMercadoPago/'+this.json.IdentificadorTransaccion
                // Recibir el resultado del pago
                resolve();
              })
              .catch(() => {
                window.location.href = this.urlPortal+'AulaVirtual/PagoExitosoMercadoPago/'+this.json.IdentificadorTransaccion
                // Tratar respuesta de error al intentar crear el pago
                reject();
              });
          });
        },
        onError: (error: any) => {
          // Callback llamado para todos los casos de error de Brick
        },
      },
    };
    const cardPaymentBrickContainer = document.getElementById('cardPaymentBrick_container');
    if (cardPaymentBrickContainer) {
      window.cardPaymentBrickController = await bricksBuilder.create(
        'cardPayment',
        'cardPaymentBrick_container',
        settings
      );
    }
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
