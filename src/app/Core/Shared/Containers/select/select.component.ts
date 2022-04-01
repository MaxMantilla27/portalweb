import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Basic, BasicUrl } from 'src/app/Core/Models/BasicDTO';

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
  @Input() dataUrl:Array<BasicUrl>=[];
  @Input() valueDefecto:number=0;


  selected :number= 0;
  Urlselected:string='';
  NameSelected:string='';

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.valueDefecto!=0){
      this.GetDataFromDatUrl();
    }

  }
  GetDataFromDatUrl(){
    this.Urlselected=this.dataUrl.filter(x=>x.value==this.valueDefecto)[0].Url;
    this.NameSelected=this.dataUrl.filter(x=>x.value==this.valueDefecto)[0].Nombre;
  }
  ChangeSelected(value:any){

    this.GetDataFromDatUrl();
  }

}
