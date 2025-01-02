import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LandingPageService } from 'src/app/Core/Shared/Services/LandingPage/landing-page.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { LandingPageComponent } from '../../landing-page.component';

@Component({
  selector: 'app-landing-page-interceptor',
  templateUrl: './landing-page-interceptor.component.html',
  styleUrls: ['./landing-page-interceptor.component.scss']
})
export class LandingPageInterceptorComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _LandingPageService: LandingPageService,
    public dialog: MatDialog,
    private _SessionStorage: SessionStorageService,


    @Inject(PLATFORM_ID) platformId: Object

  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public IdFormulario=0;
  public valorPrograma:any;
  public rutaLandingPage='';
  public rutaVariable='';
  public nombreProgramaLandingPage=''
  public tecnicas=[7758,7757]
  ngOnInit(): void {
    localStorage.setItem('formularioProgresivoPublicidad', JSON.stringify(true));

    window.addEventListener('unload', () => {
      localStorage.removeItem('formularioProgresivoPublicidad');
    });

    this.activatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x)
        this.IdFormulario=x['IdFormulario'];
        console.log(this.IdFormulario)

        if(this.IdFormulario!=undefined){
          this.ObtenerFormularioLandingPage();
        }
        else{

          console.log(this.router.url)
          var base=this.router.url.split('?')
          console.log(base)
          if(base.length>1){
            if(base[0].toLowerCase()=='/informacioncertificado'){
              var cert=x['cod'].split('.')
              console.log(cert)
              if(cert.length>1){
                this.router.navigate(['Certificado/'+cert[0]+'/'+cert[1]])
              }else{
                this.router.navigate(['error404']);
              }
            }else{
              this.router.navigate(['error404']);
            }
          }else{
            this.router.navigate(['error404']);
          }
        }
      }
    });
  }
  ObtenerFormularioLandingPage(){
    this._LandingPageService.ObtenerFormularioLandingPage(this.IdFormulario).pipe(takeUntil(this.signal$)).subscribe({
      next: x=>{
        console.log(x)
        if(x!=undefined)
        {
          this.valorPrograma=x;
          this._SessionStorage.SessionSetValueCokies("idCampania",this.valorPrograma.idConjuntoAnuncio,1)
          this._SessionStorage.SessionSetValueCokies("idCategoria",this.valorPrograma.idCategoriaOrigen,1)
          this._SessionStorage.SessionSetValueCokies("IdPEspecificoPublicidad",this.valorPrograma.idPEspecifico,1)
          this.nombreProgramaLandingPage=this.valorPrograma.categoriaNombre.replace(/-/g,' ')
          console.log(this.nombreProgramaLandingPage)
          this.OpenModalLandingPage();
          if(this.tecnicas.find(element => element ==x.idBusqueda)){
            this.router.navigate(['/tecnico-productivo/'+this.valorPrograma.categoriaNombre+'-'+this.valorPrograma.idBusqueda]);

          }else{
            this.router.navigate(['/'+this.valorPrograma.areaCapacitacion+'/'+this.valorPrograma.categoriaNombre+'-'+this.valorPrograma.idBusqueda]);
          }
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
  OpenModalLandingPage(): void {
    const dialogRef = this.dialog.open(LandingPageComponent, {
      width: '475px',
      data: { NombrePrograma:this.nombreProgramaLandingPage,
              IdCategoriaOrigen:this.valorPrograma.idCategoriaOrigen,
              IdConjuntoAnuncio:this.valorPrograma.idConjuntoAnuncio,
              IdFormulario:this.valorPrograma.idFormulario,
              IdCentroCosto:this.valorPrograma.idCentroCosto,
              CampoContacto: this.valorPrograma.campoContacto
            },
      panelClass: 'dialog-landing-page',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
    });

    dialogRef.beforeClosed().subscribe(() => {
      localStorage.removeItem('formularioProgresivoPublicidad');
    });
  }

}
