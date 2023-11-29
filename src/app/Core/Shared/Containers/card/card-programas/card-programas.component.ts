
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from '../../../Services/helper.service';

@Component({
  selector: 'app-card-programas',
  templateUrl: './card-programas.component.html',
  styleUrls: ['./card-programas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardProgramasComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
    private router:Router
  ) { }
  public hoverimg=false;
  @Input() cardContent:CardProgramasDTO={Content:'',Img:'',Url:'',Title:'',ImgAlt:'',Inversion:''};
  @Input() Interaccion=''
  ngOnInit(): void {
  }

  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Más información >',Programa:nombre,Seccion:this.Interaccion})
  }
  nvigate(url:string){
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate([url]);
    });
  }
}
