import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-header-programa',
  templateUrl: './header-programa.component.html',
  styleUrls: ['./header-programa.component.scss']
})
export class HeaderProgramaComponent implements OnInit {

  @Input() nombreCurso: any;

  constructor(
    private _HelperServiceP: HelperService,
  ) { }

  ngOnInit(): void {
    console.log(this.nombreCurso);

    if(this.nombreCurso!=null){
      this.nombreCurso = "<h1>"+this.nombreCurso+"</h1>";
      this.nombreCurso = this.nombreCurso.replace("<h1><h1>","<h1>").replace("</h1></h1>","</h1>");
      this.nombreCurso = this.nombreCurso.replace("<h1>","").replace("</h1>","");
      console.log(this.nombreCurso);
    }
  }

  EventoInteraccionButton(nombre:string){
    this._HelperServiceP.enviarMsjAcciones({Tag:"Button",Nombre:nombre})
  }

  OpenModal(){
    
  }

}
