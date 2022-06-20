import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VigenciaAccesoPruebaComponent } from 'src/app/aula-virtual/mis-cursos/vigencia-acceso-prueba/vigencia-acceso-prueba/vigencia-acceso-prueba.component';
import { CardMatriculasPruebaDTO } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-card-matriculas-prueba',
  templateUrl: './card-matriculas-prueba.component.html',
  styleUrls: ['./card-matriculas-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardMatriculasPruebaComponent implements OnInit {

  constructor(
    public dialog: MatDialog

  ) { }
  @Input() cardContent:CardMatriculasPruebaDTO={Img:'',Title:'',ImgAlt:'',Tipo:1,Url:'',Valido:false};
  ngOnInit(): void {
  }
  updateUrl() {
    this.cardContent.Img = '../../../../../../assets/imagenes/sello.jpg';
  }
  OpenModal(): void {
    const dialogRef = this.dialog.open(VigenciaAccesoPruebaComponent, {
      width: '400px',
      data: { },
      panelClass: 'dialog-programas-prueba',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
