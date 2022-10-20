import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-modulo-webinars',
  templateUrl: './modulo-webinars.component.html',
  styleUrls: ['./modulo-webinars.component.scss']
})
export class ModuloWebinarsComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _HelperService:HelperService,
    private _DatosPerfilService:DatosPerfilService,
    private router:Router,
    private _SnackBarServiceService: SnackBarServiceService,
    private _ActivatedRoute:ActivatedRoute
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() Capitulo='';
  @Input() IdMatriculaCabecera=0;
  public NombreAlumno='';
  public DetallesWebinar:Array<any>=[];
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe(
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
    this._DatosPerfilService.ListaWebinarProgramaMatriculadoRegistrado(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
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
      window.open(w.urlWebex);
    }
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Webinars'})
  }
}
