import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChatDetalleIntegraService } from '../../Services/ChatDetalleIntegra/chat-detalle-integra.service';
import { HelperService } from '../../Services/helper.service';
@Component({
  selector: 'app-soporte-tecnico',
  templateUrl: './soporte-tecnico.component.html',
  styleUrls: ['./soporte-tecnico.component.scss']
})
export class SoporteTecnicoComponent implements OnInit,OnChanges {

  constructor(
    private router: Router
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.token)
    console.log(this.IdPGeneral)
    console.log(this.cargaChat)
  }
  public rutabase=''
  @Input() cargaChat=false
  @Input() Open=false
  @Input() token=false
  @Input() IdPGeneral=0
  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  ngOnInit(): void {

    this.router.events.subscribe((val) => {
      this.rutabase=this.router.url.split('/')[1]
    })
  }
}
