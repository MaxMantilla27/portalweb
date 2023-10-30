import { Component, OnDestroy, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { timer, takeUntil, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eval',
  templateUrl: './eval.component.html',
  styleUrls: ['./eval.component.scss']
})
export class EvalComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor() { }

  public hubConnection: any;
  public urlSignal=environment.url_signal
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl(this.urlSignal+"hubIntegraHub?idUsuario=11&&usuarioNombre=Anonimo&&rooms=633").build();

    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.serverTimeoutInMilliseconds = 36000000;

    this.ConectarSocket();

    this.hubConnection.onclose(() => {
      timer(10000).pipe(takeUntil(this.signal$)).subscribe(_=>{
      })
    });
    this.obtenerData();
  }

  ConectarSocket(IdFaseOportunidadPortal?:string){
    this.hubConnection.start()
      .then((x:any) =>{
      })
      .catch((err:any) =>{});
  }
  Eval(e:any){
    console.log(e)
    console.log(eval(e))
  }
  ActualizarIntegraWhatsAppPruebas(){
    this.hubConnection.invoke("ActualizarIntegraWhatsAppPruebas")
  }
  obtenerData(){
    this.hubConnection.on("obtenerData",(x:any)=>{
        console.log(x)
    })
  }
}
