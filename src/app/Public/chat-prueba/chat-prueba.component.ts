import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chat-prueba',
  templateUrl: './chat-prueba.component.html',
  styleUrls: ['./chat-prueba.component.scss']
})
export class ChatPruebaComponent implements OnInit {

  constructor() { }
  public idUsuario=4922018
  public usuarioNombre="Walter Ruiz"
  public rooms=["","","","","","",""]
  public hubConnection: any;

  public urlSignal=environment.url_signal
  ngOnInit(): void {
  }
  concted(){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl(this.urlSignal+"hubChatWhatsapp_Peru?idUsuario="+this.idUsuario+"&&usuarioNombre="+this.usuarioNombre+"&&rooms="+this.rooms+"").build();

    console.log(this.hubConnection)

    this.ConectarSocket();
    this.hubConnection.onclose(() => {
      setTimeout(()=>{
        this.ConectarSocket();
      },10000)
    });

  }
  ConectarSocket(){
    this.hubConnection.start()
      .then((x:any) =>{this.AsesorConectado()})
      .catch((err:any) =>console.log('Error while starting connection: ' + err));
  }

  AsesorConectado(){
    var obj = {
        Id: 0,
        WaTo: 'Prueba',
        WaType: "text",
        WaTypeMensaje: 1,
        WaRecipientType: "individual",
        WaBody: 'prueba-ignorar',
        IdPais: 51,
        IdPersonal: 0,
        IdAlumno: 0,
        EsMigracion: true,
        IdMigracion: 0,
        usuario: 'asd'
    };
    console.log(obj)
    this.hubConnection.invoke("OpSend",obj)
  }
}
