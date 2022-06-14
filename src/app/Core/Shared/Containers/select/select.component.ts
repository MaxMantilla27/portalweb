import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, MAT_SELECT_CONFIG } from '@angular/material/select';
import { Basic, BasicUrl, BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customClass' },
    },
  ],
})
export class SelectComponent implements OnInit,AfterViewInit {

  @ViewChild('myselsetc') myselsetc!: MatSelect;
  constructor() { }
  ngAfterViewInit(): void {

    console.log(this.myselsetc)
    this.myselsetc.openedChange.subscribe((open) => {
      if (open) {
        var itemAc=this.myselsetc.options['_results'].find((x:any)=>x._selected==true);
        if(itemAc!=undefined){
          this.myselsetc.panel.nativeElement.scrollTop=itemAc['_element'].nativeElement.offsetTop;
        }else{
          this.myselsetc.panel.nativeElement.scrollTop-=120;
        }
      }
    });
  }
  @Input() tipo:number=1;
  @Input() label:string='';
  @Input() data:Array<Basic>=[];
  @Input() dataUrl:Array<BasicUrlIcon>=[];
  @Input() valueDefecto:string="INTC";
  @Input() token:boolean=false;

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
    this.Urlselected=this.dataUrl.filter(x=>x.value==this.valueDefecto)[0].Icon;
    this.NameSelected=this.dataUrl.filter(x=>x.value==this.valueDefecto)[0].Nombre;
  }
  ChangeSelected(value:any){

    this.GetDataFromDatUrl();
    this.Cambio.emit(this.valueDefecto);
  }

}
