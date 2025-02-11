import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-header-programa',
  templateUrl: './header-programa.component.html',
  styleUrls: ['./header-programa.component.scss']
})
export class HeaderProgramaComponent implements OnInit {

  @Input() nombreCurso: any;
  //crea un input que acepte un elementref
  @Input() seccion!: any;

  constructor(
    private _HelperServiceP: HelperService,
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const section = document.getElementById('seccion1'); // Cambia 'section1' por el ID de la sección deseada
    // console.log(offset);
    // console.log(section)
    if (section) {
      const sectionOffset = section.offsetTop;
      this._HelperServiceP.enviarScrollHeaderPrograma(offset >= sectionOffset);
    }
  }

  ngOnInit(): void {
    this.onWindowScroll();
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
