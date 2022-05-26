import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-modulo-webinars',
  templateUrl: './modulo-webinars.component.html',
  styleUrls: ['./modulo-webinars.component.scss']
})
export class ModuloWebinarsComponent implements OnInit {

  constructor(
    private _HelperService:HelperService,
    private _DatosPerfilService:DatosPerfilService
  ) { }
  @Input() Capitulo='';
  @Input() IdMatriculaCabecera=0;
  public NombreAlumno='';
  public DetallesWebinar:Array<any>=[];
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe(
      (x) => {
      this.NombreAlumno = x.datosAlumno.nombres;
      console.log(this.NombreAlumno);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatriculaCabecera!=0){
      this.ObtenerWebinarMatricula()
    }
  }
  ObtenerWebinarMatricula(){
    this._DatosPerfilService.ListaWebinarProgramaMatriculadoRegistrado(this.IdMatriculaCabecera).subscribe({
      next:(x)=>{
        this.DetallesWebinar=x;
        console.log(this.DetallesWebinar);
      }
    })
  }

}
