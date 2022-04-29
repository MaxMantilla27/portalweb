import { Component, Input, OnInit } from '@angular/core';
import { listaExpositorDTO } from 'src/app/Core/Models/listaExpositorDTO';

@Component({
  selector: 'app-card-expositores',
  templateUrl: './card-expositores.component.html',
  styleUrls: ['./card-expositores.component.scss']
})
export class CardExpositoresComponent implements OnInit {

  constructor() { }
  @Input() expositor:listaExpositorDTO={
    apellidoPaterno:'',
    fotoDocente:'',
    hojaVidaResumidaPerfil:'',
    nombrePais:'',
    primerNombre:'',
  }
  ngOnInit(): void {
    this.expositor.hojaVidaResumidaPerfil=this.expositor.hojaVidaResumidaPerfil.split('justify').join('center')
  }

}
