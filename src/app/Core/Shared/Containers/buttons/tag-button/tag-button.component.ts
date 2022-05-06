import { Component, Input, OnInit } from '@angular/core';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';

@Component({
  selector: 'app-tag-button',
  templateUrl: './tag-button.component.html',
  styleUrls: ['./tag-button.component.scss']
})
export class TagButtonComponent implements OnInit {

  constructor() { }

  @Input() tag: listaTagDTO = {nombre:'',codigo:''}
  ngOnInit(): void {
  }

}
