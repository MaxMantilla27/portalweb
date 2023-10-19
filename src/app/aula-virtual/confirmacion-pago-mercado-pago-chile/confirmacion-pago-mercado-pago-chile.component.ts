import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

const PK_Produccion ="APP_USR-655cbc43-a08f-482f-a7bc-df64d486c667";
const PK_Prueba ="TEST-4afbabcc-eedf-4dfb-b8ce-9703a5b7f973";
@Component({
  selector: 'app-confirmacion-pago-mercado-pago-chile',
  templateUrl: './confirmacion-pago-mercado-pago-chile.component.html',
  styleUrls: ['./confirmacion-pago-mercado-pago-chile.component.scss']
})
export class ConfirmacionPagoMercadoPagoChileComponent implements OnInit {
  private signal$ = new Subject()

  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _SessionStorageService:SessionStorageService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _router:Router,
    public dialog: MatDialog,
  ) { }

  idMatricula:any
  resultPreProcesoMP:any;
  hiden=true
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  dialogRefLoader:any


  ngOnInit(){
    this.dialogRefLoader =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.json.IdentificadorTransaccion = x['Identificador'];
        var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
        if(r!=''){
          this.json.RequiereDatosTarjeta=r=='false'?false:true;
          //this._SessionStorageService.SessionDeleteValue(this.json.IdentificadorTransaccion);
          this.ObtenerPreProcesoPagoCuotaAlumno()
        }
      },
    });
    
  }


  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultPreProcesoMP=x._Repuesta;
        this.resultPreProcesoMP.total=0;
        this.resultPreProcesoMP.listaCuota.forEach((l:any) => {
          this.resultPreProcesoMP.total+=l.cuotaTotal
        });
        this.iniciarJSMercadoPago()
        setTimeout(()=>{
          this.renderCardPaymentBrick(window)
        },500)

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
        amount: this.resultPreProcesoMP.total, // Monto a ser pagado
        payer: {
          email: this.resultPreProcesoMP.registroAlumno.correo,
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
            const elementosConAlt = document.querySelectorAll('[alt="Tarjeta ingresada diners"]');
            if (elementosConAlt.length > 0) {
              elementosConAlt.forEach(elemento => {
                elemento.remove();
              });
            } 
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
            this.dialogRefLoader.close()
          }, 500);
          
        },
        onSubmit: (cardFormData: any) => {
          // Callback llamado al hacer clic en el botón de envío de datos
          this.dialogRefLoader =this.dialog.open(ChargeComponent,{
            panelClass:'dialog-charge',
            disableClose:true
          });
          cardFormData.identificadorTransaccion = this.json.IdentificadorTransaccion
          cardFormData.description = this.resultPreProcesoMP.nombrePrograma
          return new Promise<void>((resolve, reject) => {
            fetch('https://api-portalweb.bsginstitute.com/api/FormaPago/ProcesarPagoCuotaAlumnoConfirmarMercadoPago', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(cardFormData),
            })
              .then(() => {
                this.dialogRefLoader.close()
                window.location.href = 'https://bsginstitute.com/AulaVirtual/PagoExitosoMercadoPago/'+this.json.IdentificadorTransaccion
                // Recibir el resultado del pago
                resolve();
              })
              .catch(() => {
                this.dialogRefLoader.close()
                window.location.href = 'https://bsginstitute.com/AulaVirtual/PagoExitosoMercadoPago/'+this.json.IdentificadorTransaccion

                // Tratar respuesta de error al intentar crear el pago
                reject();
              });
          });
        },
        onError: (error: any) => {
          // Callback llamado para todos los casos de error de Brick
          this._SnackBarServiceService.openSnackBar(
            'Ocurrio un error al cargar MercadoPago, refresque la pagina.',
            'x',
            5,
            'snackbarCrucigramaerror'
          );
          this.dialogRefLoader.close()
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

}


