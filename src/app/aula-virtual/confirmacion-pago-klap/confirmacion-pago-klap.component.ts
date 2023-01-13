import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EnviosKlap } from 'src/app/Core/Models/Pasarela-Klap';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-confirmacion-pago-klap',
  templateUrl: './confirmacion-pago-klap.component.html',
  styleUrls: ['./confirmacion-pago-klap.component.scss']
})
export class ConfirmacionPagoKlapComponent implements OnInit {

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
  resultPreProcesoKlap:any;
  numberCard:any=''
  nameTitularCard:any=''
  fechaExpiredCard:any=''
  cvvCard :any=''
  numberDoc :any=''
  rut :any=''
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }


  public jsonSave:EnviosKlap={
    consumer_transaction_id: '',
    rut:'',
    preProceso:new Object
  }


  ngOnInit(): void {
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
        this.resultPreProcesoKlap=x._Repuesta;
        this.resultPreProcesoKlap.total=0;
        this.resultPreProcesoKlap.listaCuota.forEach((l:any) => {
          this.resultPreProcesoKlap.total+=l.cuotaTotal
        });

        this.jsonSave.consumer_transaction_id=this.resultPreProcesoKlap.identificadorTransaccion
        this.nameTitularCard = this.resultPreProcesoKlap.registroAlumno.nombre + " " + this.resultPreProcesoKlap.registroAlumno.apellido
        this.numberDoc = this.resultPreProcesoKlap.registroAlumno.numeroDocumento
        this.jsonSave.preProceso = this.resultPreProcesoKlap
      }
    })
  }

  RealizarPagoklap(){

    var validate=true
    if(this.nameTitularCard=='' || this.nameTitularCard==undefined){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese los nombres del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }

    if(this.numberDoc==null || this.numberDoc.length<=5 || this.numberDoc==undefined){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese el documento completo del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
    if(this.rut==null || this.rut.length<=7 || this.rut==undefined){
      validate = false;
      this._SnackBarServiceService.openSnackBar(
        'Ingrese RUT valido y completo del titular',
        'x',
        5,
        'snackbarCrucigramaerror'
      );
    }
    console.log(validate);
    if (validate) {
      const dialogRef =this.dialog.open(ChargeComponent,{
        panelClass:'dialog-charge',
        disableClose:true
      });
      this.jsonSave.rut = this.rut
      this._FormaPagoService.ProcesarPagoConfirmadoKlap(this.jsonSave).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          if(x._Repuesta.estado ==true)
          {
            let jsonObj = JSON.parse(x._Repuesta.klapResult);
            let urlRedirect =jsonObj.redirect_url

            window.location.href = urlRedirect;
          }
          else if (x._Repuesta.estado ==false)
          {
            dialogRef.close()
            this._SnackBarServiceService.openSnackBar(
              'Ocurrio un problema al validar los datos, verifique que todo este correcto!',
              'x',
              5,
              'snackbarCrucigramaerror'
            );
          }
        }
      })
      
    }
  }
}
