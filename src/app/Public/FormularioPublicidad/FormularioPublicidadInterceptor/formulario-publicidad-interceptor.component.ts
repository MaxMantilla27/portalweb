import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormularioPublicidadService } from 'src/app/Core/Shared/Services/FormularioPublicidad/formulario-publicidad.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { FormularioPublicidadComponent } from '../formulario-publicidad.component';


@Component({
  selector: 'app-formulario-publicidad-interceptor',
  templateUrl: './formulario-publicidad-interceptor.component.html',
  styleUrls: ['./formulario-publicidad-interceptor.component.scss']
})
export class FormularioPublicidadInterceptorComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _FormularioPublicidadService: FormularioPublicidadService,
    public dialog: MatDialog,
    private _SessionStorage: SessionStorageService,

    @Inject(PLATFORM_ID) platformId: Object

  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public Formulario='';
  public valorPrograma:any;
  public rutaFormularioPublicidad='';
  public rutaVariable='';
  public nombreProgramaFormularioPublicidad=''


  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x)
        this.Formulario=x['formulario'];
        console.log(this.Formulario)
        if(this.Formulario!=undefined){
        this.ObtenerFormularioPublicidad();
        }
        else{
          this.router.navigate(['error404']);
        }
      }
    });
  }

  ObtenerFormularioPublicidad(){
    this._FormularioPublicidadService.ObtenerFormularioPublicidad(this.Formulario).pipe(takeUntil(this.signal$)).subscribe({
      next: x=>{
        console.log(x)
        if(x!=undefined)
        {
          this.valorPrograma=x;
          this._SessionStorage.SessionSetValue("idCampania",this.valorPrograma.idConjuntoAnuncio)
          this._SessionStorage.SessionSetValueCokies("idCategoria",this.valorPrograma.idCategoriaOrigen,1)
          this._SessionStorage.SessionSetValueCokies("IdPEspecificoPublicidad",this.valorPrograma.idPEspecifico,1)
          this.nombreProgramaFormularioPublicidad=this.valorPrograma.categoriaNombre.replace(/-/g,' ')
          console.log(this.nombreProgramaFormularioPublicidad)
          this.OpenModalFormularioPublicidad();
          this.router.navigate(['/'+this.valorPrograma.areaCapacitacion+'/'+this.valorPrograma.categoriaNombre+'-'+this.valorPrograma.idBusqueda]);
        }
        else{
          this.router.navigate(['error404']);
        }
      },
      error: () => {
        this.router.navigate(['error404']);
      },
    })
  }
  OpenModalFormularioPublicidad(): void {
    const dialogRef = this.dialog.open(FormularioPublicidadComponent, {
      width: '475px',
      data: { NombrePrograma:this.nombreProgramaFormularioPublicidad,
              IdCategoriaOrigen:this.valorPrograma.idCategoriaOrigen,
              IdConjuntoAnuncio:this.valorPrograma.idConjuntoAnuncio,
              IdFormulario:this.valorPrograma.idFormulario,
              IdCentroCosto:this.valorPrograma.idCentroCosto
            },
      panelClass: 'dialog-formulario-publicidad',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
    });
  }

}
