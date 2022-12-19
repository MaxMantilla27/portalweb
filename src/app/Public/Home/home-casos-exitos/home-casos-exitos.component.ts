import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CasosExitoDTO } from 'src/app/Core/Models/CasosExitoDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-home-casos-exitos',
  templateUrl: './home-casos-exitos.component.html',
  styleUrls: ['./home-casos-exitos.component.scss'],
})
export class HomeCasosExitosComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
    config: NgbCarouselConfig,
  ) {
    config.interval = 10000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  public casosExito:Array<CasosExitoDTO>=[
    {Curso:"Curso MS Project aplicado a la Gestión de Proyectos",img:'kerly-pacheco.png',Nombre:'KERLY PACHECO',Texto:'La experiencia ha sido muy buena, porque he podido ampliar los conocimientos que tenia.'},
    {Curso:"Lean Six Sigma Black Belt",img:'heddy-honorio.png',Nombre:'HEDDY HONORIO',Texto:'La motivación de la certificación internacional que ofrece el programa fue un estímulo muy alto para matricularme'},
    {Curso:"Lean Six Sigma Black Belt",img:'jorge-rojas.png',Nombre:'JORGE ROJAS',Texto:'La gran diferencia con la competencia fue que: uno, la flexibilidad de horarios y número dos, BSG Institute te prepara, te brinda las pautas y te hacen un seguimiento personalizado para acceder a la certificación internacional.'}
  ];

  ngOnInit(): void {
  }
  EventoInteraccionCarrousel(event:any,nombre:string){
    if(event.source!='timer'){
      this._HelperService.enviarMsjAcciones({Tag:'Carousel',Nombre:nombre,Accion:event.source})
    }
  }
}
