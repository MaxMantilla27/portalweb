import { Component, OnInit } from '@angular/core';
import { LibroReclamacionesDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';

@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.component.html',
  styleUrls: ['./libro-reclamaciones.component.scss']
})
export class LibroReclamacionesComponent implements OnInit {

  constructor() { }

  public migaPan: any = [];
  public fecha=new Date();
  public reclamo:LibroReclamacionesDTO={
    apoderado:'',
    celular:'',
    domicilio:'',
    email:'',
    nombres:'',
    pedido:'',
    detalle:'',
    servicio:'',
    tipo_reclamo:1,
    tipo_servicio:1,
  }
  ngOnInit(): void {
    setInterval(()=>{
      this.fecha=new Date();
    },1000);
    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Libro de Reclamaciones',
        urlWeb: '/LibroReclamacion'
      }
    ]
  }
  chageRadio(value:number){
    if(value==1){
      return 2;
    }
    return 1;
  }
  GenerarReclamo(){
    console.log(this.reclamo)
  }
}
