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
  // public idUsuario=4922018
  // public usuarioNombre="Walter Ruiz"
  // public rooms=["","","","","","",""]

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
      .withUrl(this.urlSignal+"hubIntegraHub?idUsuario="+this.idUsuario+"&&usuarioNombre="+this.usuarioNombre+"&&rooms="+this.rooms+"").build();

    console.log(this.hubConnection)

    this.ConectarSocket();
    this.hubConnection.onclose(() => {
      setTimeout(()=>{
        this.ConectarSocket();
      },10000)
    });
    this.newChat();
    this.addMessage();
  }
  ConectarSocket(){
    this.hubConnection.start()
      .then((x:any) =>{this.AsesorConectado()})
      .catch((err:any) =>console.log('Error while starting connection: ' + err));

  }

  AsesorConectado(){
    this.hubConnection.invoke("AsesorConectado",this.usuarioNombre,643)
  }

  newChat(){
    this.hubConnection.on("newChat",(data:any)=>{
      console.log(data)
    })
  }
  addMessage(){
    this.hubConnection.on("addMessage",(data:any)=>{
      console.log(data)
    })
  }
}
