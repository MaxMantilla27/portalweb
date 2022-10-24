import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LandingPageV2Service } from 'src/app/Core/Shared/Services/LandingPageV2/landing-page-v2.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { LandingPageModalComponent } from './landing-page-modal/landing-page-modal.component';

@Component({
  selector: 'app-landin-page-v2',
  templateUrl: './landin-page-v2.component.html',
  styleUrls: ['./landin-page-v2.component.scss'],
})
export class LandinPageV2Component implements OnInit, OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _LandingPageV2Service: LandingPageV2Service,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _SessionStorage: SessionStorageService,

    @Inject(PLATFORM_ID) platformId: Object
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        this.IdFormulario = x['IdFormulario'];
        console.log(this.IdFormulario);

        if (this.IdFormulario != undefined) {
          this.ObtenerFormularioLandingPageV2();
        } else {
         this.router.navigate(['error404']);
        }
      },
    });
  }
  public IdFormulario = 0;
  public valorPrograma: any;
  public rutaLandingPage = '';
  public rutaVariable = '';
  public nombreProgramaLandingPage = '';

  ObtenerFormularioLandingPageV2() {
    this._LandingPageV2Service
      .ObtenerLandingPagePortal(this.IdFormulario)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          if (x != undefined) {
            this.valorPrograma = x;
            this._SessionStorage.SessionSetValue(
              'idCampania',
              this.valorPrograma.idConjuntoAnuncio
            );
            this._SessionStorage.SessionSetValueCokies(
              'idCategoria',
              this.valorPrograma.idCategoriaOrigen,
              1
            );
            this._SessionStorage.SessionSetValueCokies(
              'IdPEspecificoPublicidad',
              this.valorPrograma.idPEspecifico,
              1
            );
            this.nombreProgramaLandingPage =
              this.valorPrograma.categoriaNombre.replace(/-/g, ' ');
            console.log(this.nombreProgramaLandingPage);
            this.OpenModalLandingPage();
            this.router.navigate([
              '/' +
                this.valorPrograma.areaCapacitacion +
                '/' +
                this.valorPrograma.categoriaNombre +
                '-' +
                this.valorPrograma.idBusqueda,
            ]);
          } else {
           this.router.navigate(['error404']);
          }
        },
        error: () => {
         this.router.navigate(['error404']);
        },
      });
  }

  OpenModalLandingPage(): void {
    const dialogRef = this.dialog.open(LandingPageModalComponent, {
      width: '475px',
      data: {
        NombrePrograma: this.nombreProgramaLandingPage,
        valorPrograma: this.valorPrograma
      },
      panelClass: 'dialog-landing-page',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.signal$))
      .subscribe((result) => {});
  }
}
