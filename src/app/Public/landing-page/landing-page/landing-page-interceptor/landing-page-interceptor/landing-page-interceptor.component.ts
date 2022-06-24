import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LandingPageService } from 'src/app/Core/Shared/Services/LandingPage/landing-page.service';
import { LandingPageComponent } from '../../landing-page.component';

@Component({
  selector: 'app-landing-page-interceptor',
  templateUrl: './landing-page-interceptor.component.html',
  styleUrls: ['./landing-page-interceptor.component.scss']
})
export class LandingPageInterceptorComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _LandingPageService: LandingPageService,
    public dialog: MatDialog,

    @Inject(PLATFORM_ID) platformId: Object

  ) { }
  public IdFormulario=0;
  public valorPrograma:any;
  public rutaLandingPage='';
  public rutaVariable='';
  public nombreProgramaLandingPage=''
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next:(x)=>{
        this.IdFormulario=x['IdFormulario'];
        if(this.IdFormulario!=undefined){
        this.ObtenerFormularioLandingPage();

        }
      }
    });
  }

  ObtenerFormularioLandingPage(){
    this._LandingPageService.ObtenerFormularioLandingPage(this.IdFormulario).subscribe((x)=>{
      this.valorPrograma=x;
      console.log(this.valorPrograma)
      this.nombreProgramaLandingPage=this.valorPrograma.categoriaNombre.replace(/-/g,' ')
      console.log(this.nombreProgramaLandingPage)
      this.OpenModalLandingPage();
        this.router.navigate(['/'+this.valorPrograma.areaCapacitacion+'/'+this.valorPrograma.categoriaNombre+'-'+this.valorPrograma.idBusqueda]);
    })
  }
  OpenModalLandingPage(): void {
    const dialogRef = this.dialog.open(LandingPageComponent, {
      width: '600px',
      data: { NombrePrograma:this.nombreProgramaLandingPage,
              IdCategoriaOrigen:this.valorPrograma.idCategoriaOrigen,
              IdConjuntoAnuncio:this.valorPrograma.idConjuntoAnuncio,
              IdFormulario:this.valorPrograma.idFormulario,
              IdCentroCosto:this.valorPrograma.idCentroCosto
            },
      panelClass: 'dialog-landing-page',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

}
