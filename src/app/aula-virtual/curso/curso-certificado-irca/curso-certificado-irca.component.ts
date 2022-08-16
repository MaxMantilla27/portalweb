import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-curso-certificado-irca',
  templateUrl: './curso-certificado-irca.component.html',
  styleUrls: ['./curso-certificado-irca.component.scss']
})
export class CursoCertificadoIrcaComponent implements OnInit,OnChanges {

  constructor() { }
  @Input() Ircas:Array<any>=[]
  @Input() Capitulo='';
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.Ircas);

  }
}
