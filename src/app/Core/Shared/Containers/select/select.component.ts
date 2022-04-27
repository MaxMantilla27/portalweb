import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Basic, BasicUrl, BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {

  constructor() { }
  @Input() tipo:number=1;
  @Input() label:string='';
  @Input() data:Array<Basic>=[];
  @Input() dataUrl:Array<BasicUrlIcon>=[];
  @Input() valueDefecto:string="INTC";

  @Output()
  Cambio: EventEmitter<string> = new EventEmitter<string>();

  selected :number= 0;
  Urlselected:string='';
  NameSelected:string='';
  Iso:string='';

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.dataUrl.length>0){
      this.GetDataFromDatUrl();
    }

  }
  GetDataFromDatUrl(){
    this.Urlselected=this.dataUrl.filter(x=>x.value==this.valueDefecto)[0].Url;
    this.NameSelected=this.dataUrl.filter(x=>x.value==this.valueDefecto)[0].Nombre;
  }
  ChangeSelected(value:any){

    this.GetDataFromDatUrl();
    this.Cambio.emit(this.valueDefecto);
  }

}
