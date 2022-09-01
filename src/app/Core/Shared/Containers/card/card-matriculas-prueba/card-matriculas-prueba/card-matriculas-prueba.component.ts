import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VigenciaAccesoPruebaComponent } from 'src/app/aula-virtual/mis-cursos/vigencia-acceso-prueba/vigencia-acceso-prueba/vigencia-acceso-prueba.component';
import { CardMatriculasPruebaDTO } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-card-matriculas-prueba',
  templateUrl: './card-matriculas-prueba.component.html',
  styleUrls: ['./card-matriculas-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardMatriculasPruebaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private _router:Router

  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() cardContent:CardMatriculasPruebaDTO={Img:'',Title:'',ImgAlt:'',Tipo:1,Url:'',Valido:false};
  ngOnInit(): void {
  }
  updateUrl() {
    this.cardContent.Img = '../../../../../../assets/imagenes/sello.jpg';
  }
  navigate(url:string){
    this._router.navigate([url])
  }
  OpenModal(): void {
    const dialogRef = this.dialog.open(VigenciaAccesoPruebaComponent, {
      width: '400px',
      data: { },
      panelClass: 'dialog-programas-prueba',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
