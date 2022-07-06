import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-modulo-webinars',
  templateUrl: './modulo-webinars.component.html',
  styleUrls: ['./modulo-webinars.component.scss']
})
export class ModuloWebinarsComponent implements OnInit {

  constructor(
    private _HelperService:HelperService,
    private _DatosPerfilService:DatosPerfilService,
    private router:Router,
    private _SnackBarServiceService: SnackBarServiceService,
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
  IrAWebinar(index:number){
    var w=this.DetallesWebinar[index];
    if(w.esWebinarConfirmado==false){
      this._SnackBarServiceService.openSnackBar("El webinar no esta disponible todavia",'x',10,"snackbarCrucigramaerror");
    }else{
      this.router.navigate([w.urlWebex]);
    }
  }
}
